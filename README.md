# Image Convolution

This workflow performs industrial optical QA on a large set of input images.

#### Overview

This repository contains a parallel implementation, orchestrated with the Abstract Function Choreography Language and runnable on the [Apollo Engine](https://github.com/Apollo-Core)


![workflow-slim diagram](./diagrams/workflow.svg)

**Fig 1: workflow.yaml control and data flow**



#### Get the code

```
git clone https://github.com/Apollo-Workflows/Image-Recognition
cd Image-Recognition
```

#### Get an input dataset

number of images | comment | link 
----|---- | -----
200 | `52.png`, `55.png`, and `184.png` should be detected as polluted |  [datasets/200](https://github.com/Apollo-Workflows/Image-Recognition/tree/master/datasets/200)
400 | `98.png` and `121.png` should be detected as polluted |  [datasets/400](https://github.com/Apollo-Workflows/Image-Recognition/tree/master/datasets/400)
800 | `544.png`, `762.png` and `773.png` should be detected as polluted |  [datasets/800](https://github.com/Apollo-Workflows/Image-Recognition/tree/master/datasets/800)




Then, update `input.json` with the desired parallelism. The default is 2. This yields a 100 images per 1 convolution function ratio for the [200](https://github.com/Apollo-Workflows/Image-Recognition/tree/master/datasets/200) dataset.


```
{
  "desired_num_splits": 1     // <---
  "s3bucket": "YOUR_BUCKET",
  "s3prefix": "YOUR/PREFIX",
  "topic_arn": "YOUR_TOPIC",
  "region": "us-east-2",
}
```

#### Autodeploy
1. Save the credentials for your cloud provider in the according subfolder:
   - AWS: Put credential file under `aws/credentials`
   - IBM:
     - Add `ibmcloud_api_key` to `ibm/terraform.tfvars`
     - Add S3 credentials from AWS to `ibm/s3Credentials`
2. 
   - A: Deploy to all providers:
        Run from root dir `docker run --rm -it --entrypoint=/app/deployAll.sh -v ${PWD}:/app/ chrisengelhardt/apollo-autodeploy`
   - B: Deploy single provider with custom settings:
        Run `docker run --rm -v ${PWD}:/app/ chrisengelhardt/apollo-autodeploy --help` from within the directory of your chosen cloud provider

Note: For IBM you have to create a namespace first and place it into `ibm.tf` at line `namespace = "YOURNAMESPACE"`.

```
Usage: /app/deploy.sh [--help] [--region region] [--url] [--mapping]

Commands:
        --help                  Show this help output.
        --region region         Sets a specific region for the deployment. Use a region from:
                                https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html
        --bucket bucket_name    Sets a specific bucket name for the deployment.
        --url                   Prints out all deployment urls
        --mappings              Creates typeMapping.json with the deployment urls
```

# Run the containers

To run the containers (preprocess-imgs, ir-split, ir-convolution.-educe) you must mount your input and credentials file into the correct dir as shown below:

`docker run --rm -it -v ${PWD}/input.json:/usr/src/app/input.json -v ${PWD}/credentials:/root/.aws/credentials ir-preprocess`