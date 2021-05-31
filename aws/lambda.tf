# Shared credentials file and region configuration

variable "region" {
  type        = string
  description = "The AWS region for the deployment. See https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html"
  default = "us-east-1"
}

provider "aws" {
  shared_credentials_file = "credentials"
  region                  = var.region
}

# Create a new aws iam role
resource "aws_iam_role" "iam_for_lambda" {
  name_prefix = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

 #Created Policy for IAM Role
resource "aws_iam_policy" "policy" {
  name = "s3-policy"
  description = "s3 policy"


  policy = <<EOF
{
"Version": "2012-10-17",
"Statement": [
  {
    "Effect": "Allow",
    "Action": [
        "logs:*"
    ],
    "Resource": "arn:aws:logs:*:*:*"
  },
  {
    "Effect": "Allow",
    "Action": [
        "s3:*"
    ],
    "Resource": "arn:aws:s3:::*"
  }
]
} 
EOF
}

resource "aws_iam_role_policy_attachment" "test-attach" {
  role       = "${aws_iam_role.iam_for_lambda.name}"
  policy_arn = "${aws_iam_policy.policy.arn}"
}

resource "aws_lambda_layer_version" "cv2_layer" {
  filename   = "./layers/cv2-for-amazon-linux-env.zip"
  layer_name = "cv2_layer"
  
  compatible_runtimes = ["python3.8"]
}

############################################
# Create a bucket                          #
############################################

resource "aws_s3_bucket" "b1" {

   bucket = "apollo-bucket-image-convolution-frankfurt"
   
   acl    = "public-read"   # or can be "public-read"
   
   tags = {
      Name        = "My bucket"
      Environment = "Dev"
   }
   
}

resource "aws_s3_bucket_object" "dataset200" {
    for_each = fileset("../datasets/200/", "*")
    bucket = aws_s3_bucket.b1.id
    key = "200/${each.value}"
    acl    = "public-read"  # or can be "public-read"
    source = "../datasets/200/${each.value}"
    etag = filemd5("../datasets/200/${each.value}")
}

# resource "aws_s3_bucket_object" "dataset400" {
#     for_each = fileset("../datasets/400/", "*")
#     bucket = aws_s3_bucket.b1.id
#     key = "400/${each.value}"
#     acl    = "public-read"  # or can be "public-read"
#     source = "../datasets/400/${each.value}"
#     etag = filemd5("../datasets/400/${each.value}")
# }

# resource "aws_s3_bucket_object" "dataset800" {
#     for_each = fileset("../datasets/800/", "*")
#     bucket = aws_s3_bucket.b1.id
#     key = "800/${each.value}"
#     acl    = "public-read"  # or can be "public-read"
#     source = "../datasets/800/${each.value}"
#     etag = filemd5("../datasets/800/${each.value}")
# }



############################################
# Configuration of the lambda functions    #
############################################

locals {
  function_names = ["ir-split","preprocess-imgs","ir-convolute-reduce","ir-reduce"]
  function_paths = ["lambda-functions/ir-split.zip","lambda-functions/preprocess-imgs.zip","lambda-functions/ir-convolute-reduce.zip","lambda-functions/ir-reduce.zip"]
  function_runtimes = ["nodejs14.x","python3.8","python3.8","nodejs14.x"]
  function_handlers = ["index.handler","lambda_function.lambda_handler","lambda_function.lambda_handler","index.handler"]
  function_layers = [[],[aws_lambda_layer_version.cv2_layer.arn, "arn:aws:lambda:eu-central-1:292169987271:layer:AWSLambda-Python38-SciPy1x:29"],[aws_lambda_layer_version.cv2_layer.arn, "arn:aws:lambda:eu-central-1:292169987271:layer:AWSLambda-Python38-SciPy1x:29"],[]]
}

resource "aws_lambda_function" "lambda" {
  count = length(local.function_names)

  filename      = local.function_paths[count.index]
  function_name = local.function_names[count.index]
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = local.function_handlers[count.index]
  timeout       = 300
  memory_size   =  256
  layers        = local.function_layers[count.index]
  runtime       = local.function_runtimes[count.index]
  source_code_hash = filebase64sha256(local.function_paths[count.index])
}


############################################
# Gateway sentim-inference-textblob_new    #
############################################

resource "aws_api_gateway_rest_api" "example" {
  count = length(local.function_names)

  name        = "ServerlessExample"
  description = "Terraform Serverless Application Example"
}

resource "aws_api_gateway_resource" "proxy" {
   count = length(local.function_names)
   
   rest_api_id = aws_api_gateway_rest_api.example[count.index].id
   parent_id   = aws_api_gateway_rest_api.example[count.index].root_resource_id
   path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
   count = length(local.function_names)


   rest_api_id   = aws_api_gateway_rest_api.example[count.index].id
   resource_id   = aws_api_gateway_resource.proxy[count.index].id
   http_method   = "ANY"
   authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
   count = length(local.function_names)

   rest_api_id = aws_api_gateway_rest_api.example[count.index].id
   resource_id = aws_api_gateway_method.proxy[count.index].resource_id
   http_method = aws_api_gateway_method.proxy[count.index].http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.lambda[count.index].invoke_arn
}

resource "aws_api_gateway_method" "proxy_root" {
   count = length(local.function_names)

   rest_api_id   = aws_api_gateway_rest_api.example[count.index].id
   resource_id   = aws_api_gateway_rest_api.example[count.index].root_resource_id
   http_method   = "ANY"
   authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
   count = length(local.function_names)

   rest_api_id = aws_api_gateway_rest_api.example[count.index].id
   resource_id = aws_api_gateway_method.proxy_root[count.index].resource_id
   http_method = aws_api_gateway_method.proxy_root[count.index].http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.lambda[count.index].invoke_arn
}

resource "aws_api_gateway_deployment" "example0" {
   depends_on = [
     aws_api_gateway_integration.lambda[0],
     aws_api_gateway_integration.lambda_root[0],
   ]

   rest_api_id = aws_api_gateway_rest_api.example[0].id
   stage_name  = local.function_names[0]
}

resource "aws_api_gateway_deployment" "example1" {
   depends_on = [
     aws_api_gateway_integration.lambda[1],
     aws_api_gateway_integration.lambda_root[1],
   ]

   rest_api_id = aws_api_gateway_rest_api.example[1].id
   stage_name  = local.function_names[1]
}

resource "aws_api_gateway_deployment" "example2" {
   depends_on = [
     aws_api_gateway_integration.lambda[2],
     aws_api_gateway_integration.lambda_root[2],
   ]

   rest_api_id = aws_api_gateway_rest_api.example[2].id
   stage_name  = local.function_names[2]
}

resource "aws_api_gateway_deployment" "example3" {
   depends_on = [
     aws_api_gateway_integration.lambda[3],
     aws_api_gateway_integration.lambda_root[3],
   ]

   rest_api_id = aws_api_gateway_rest_api.example[3].id
   stage_name  = local.function_names[3]
}



resource "aws_lambda_permission" "apigw" {
   count = length(local.function_names)

   statement_id  = "AllowAPIGatewayInvoke"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.lambda[count.index].function_name
   principal     = "apigateway.amazonaws.com"

   # The "/*/*" portion grants access from any method on any resource
   # within the API Gateway REST API.
   source_arn = "${aws_api_gateway_rest_api.example[count.index].execution_arn}/*/*"
}



output "url_ir-split" {
  value = aws_api_gateway_deployment.example0.invoke_url
}

output "url_preprocess-imgs" {
  value = aws_api_gateway_deployment.example1.invoke_url
}

output "url_ir-convolute-reduce" {
  value = aws_api_gateway_deployment.example2.invoke_url
}

output "url_ir-reduce" {
  value = aws_api_gateway_deployment.example3.invoke_url
}