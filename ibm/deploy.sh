#!/bin/bash
####################################################################
## Creates all necessary files for the deployment and deploys     ##
## them directly to IBM Cloud using terraform.                    ##
##                                                                ##
## It also supports the creation of a typeMappings.json.          ##
####################################################################


helpmenu () {
   echo -e "Usage: $0 [--help] [--region region] [--url] [--mapping]\n" 

   echo -e "Commands:"
   echo -e "\t--help\t\t\tShow this help output."
   echo -e "\t--region region\t\tSets a specific region for the deployment. Use a region from:"
   echo -e "\t\t\t\thttps://cloud.ibm.com/docs/containers?topic=containers-regions-and-zones"
   echo -e "\t--url\t\t\tPrints out all deployment urls"
   echo -e "\t--mappings\t\tCreates typeMapping.json with the deployment urls"
}

showURL () {
   terraform show | tail -n 4
}

createMappings () {
   python3 createTypeMappings.py
}


region="eu-de"

while [ ! $# -eq 0 ]
do
	case "$1" in
		--help | -h)
			helpmenu
			exit
			;;
        --url | -u)
			showURL
			exit
			;;
        --mappings | -m)
			createMappings
			exit
			;;
		--region)
            if [ -n "$2" ]; then
			    region=$2
			    shift
            else
                helpmenu
                exit
            fi
			;;
	esac
	shift
done

rm functions/*.zip

./build.sh --installNode ../functions/ir-split
./build.sh ../functions/preprocess-imgs
./build.sh ../functions/ir-convolute-reduce 
./build.sh ../functions/ir-reduce


terraform init

terraform apply -auto-approve -var="region=$region"

rm functions/*.zip