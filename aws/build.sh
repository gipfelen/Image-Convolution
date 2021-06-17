#!/bin/bash
#####################################################################
## Creates a zip file from a given path of a lambda function. The  ##
## created file can directly be upload to AWS Lambda.              ##
#####################################################################


if [[ $# -eq 0 ]] ; then
    echo 'Error: No path provided'
    echo -e "\nUsage: $0 /path/to/lambda/fucntion \n" 
    exit 1
fi

folderName=$(basename $1)
pwd=$(pwd)

cd $1

mkdir -p ../tmp
cp * ../tmp
cd ../tmp
[ -f main.py ] && mv main.py lambda_function.py
rm Dockerfile docker-runtime.js
zip -r $pwd/tmp/${folderName}.zip .
cd ..
rm -r tmp