#!/bin/bash
#####################################################################
## Creates a zip file from a given path of a ibm function. The     ##
## created file can directly be upload to IBM Cloud.               ##
#####################################################################


if [[ $# -eq 0 ]] ; then
    echo 'Error: No path provided'
        echo -e "\nUsage: $0 [--installNode] /path/to/fucntion \n" 
    exit 1
fi

if [[ $1 == "--installNode" ]] ; then
    if [[ $# -eq 1 ]] ; then
        echo 'Error: No path provided'
        echo -e "\nUsage: $0 [--installNode] /path/to/fucntion \n" 
        exit 1
    fi
    folderName=$(basename $2)

    cd $2

    mkdir -p ../tmp
    cp * ../tmp
    cd ../tmp
    npm install
    cp ../../s3Credentials.json config.json
    zip -r ../${folderName}.zip .
    cd ..
    rm -r tmp

else 
    folderName=$(basename $1)

    cd $1

    mkdir -p ../tmp
    cp * ../tmp
    cd ../tmp
    cp ../../s3Credentials.json config.json
    zip -r ../${folderName}.zip .
    cd ..
    rm -r tmp
fi