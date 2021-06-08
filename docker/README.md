# Run the containers

To run the containers (preprocess-imgs, ir-split, ir-convolution.-educe) you must mount your input and credentials file into the correct dir as shown below:

`docker run --rm -it -v ${PWD}/input.json:/usr/src/app/input.json -v ${PWD}/credentials:/root/.aws/credentials ir-preprocess`