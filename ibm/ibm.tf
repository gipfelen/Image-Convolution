# Access variable from terraform.tfvars
variable "ibmcloud_api_key" {}

# Support ibm provider
terraform {
  required_providers {
    ibm = {
      source  = "IBM-Cloud/ibm"
      version = "~> 1.25.0"
    }
  }
}

variable "region" {
  type        = string
  description = "The AWS region for the deployment. See https://cloud.ibm.com/docs/containers?topic=containers-regions-and-zones"
  default = "eu-de"
}

# Credentials and region configuration
provider "ibm" {
  ibmcloud_api_key   = var.ibmcloud_api_key
  region             = var.region
 alias              = "region"
}

locals {
  function_node_names = ["ir-split","ir-reduce"]
  function_python_names = ["preprocess-imgs","ir-convolute-reduce"]
}



# Function configuration
resource "ibm_function_action" "functionsNode" {
  count = length(local.function_node_names)

  name      = local.function_node_names[count.index]
  namespace = "apollo"
  provider = ibm.region

  exec {
    kind = "nodejs:12"
    code_path = "tmp/${local.function_node_names[count.index]}.zip"
  }

  # Timeout and memory
  limits {
    timeout = "60000"
    memory  = "256"
  }

  user_defined_annotations = <<EOF
        [
    {
        "key":"web-export",
        "value":true
    }
]
EOF

}

resource "ibm_function_action" "functionsPython" {
  count = length(local.function_python_names)

  name      = local.function_python_names[count.index]
  namespace = "apollo"
  provider = ibm.region

  exec {
    kind   = "blackbox"    
    image  = "gipfelen/cv2-for-ibm-linux-env"
    code_path = "tmp/${local.function_python_names[count.index]}.zip"
  }

  # Timeout and memory
  limits {
    timeout = "60000"
    memory  = "256"
  }

  user_defined_annotations = <<EOF
        [
    {
        "key":"web-export",
        "value":true
    }
]
EOF

}


output "ir-split" {
  value = "${ibm_function_action.functionsNode[0].target_endpoint_url}.json"
}

output "preprocess-imgs" {
  value = "${ibm_function_action.functionsPython[0].target_endpoint_url}.json"
}

output "ir-convolute-reduce" {
  value = "${ibm_function_action.functionsPython[1].target_endpoint_url}.json"
}

output "ir-reduce" {
  value = "${ibm_function_action.functionsNode[1].target_endpoint_url}.json"
}