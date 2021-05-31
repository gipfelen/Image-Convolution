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
  function_names = ["ir-split","preprocess-imgs","ir-convolute-reduce","ir-reduce"]
  function_runtimes = ["nodejs:12","python:3.7","python:3.7","nodejs:12"]
}



# Function configuration
resource "ibm_function_action" "functions" {
  count = length(local.function_names)

  name      = local.function_names[count.index]
  namespace = "apollo"
  provider = ibm.region

  exec {
    kind = local.function_runtimes[count.index]
    #kind   = "blackbox"    
    #image  = "gipfelen/dockernode"
    code_path = "functions/${local.function_names[count.index]}.zip"
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
  value = "${ibm_function_action.functions[0].target_endpoint_url}.json"
}

output "preprocess-imgs" {
  value = "${ibm_function_action.functions[1].target_endpoint_url}.json"
}

output "ir-convolute-reduce" {
  value = "${ibm_function_action.functions[2].target_endpoint_url}.json"
}

output "ir-reduce" {
  value = "${ibm_function_action.functions[3].target_endpoint_url}.json"
}