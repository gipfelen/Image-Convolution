import datetime
import cv2
import boto3
import numpy as np
import json
import sys
import os

MAX_DEVIATION = 5


def ir_convolute_reduce(json_input):
    cropped_images_s3_keys = json_input["cropped_images_s3_keys"]
    cropped_images_timestamps = json_input["cropped_images_timestamps"]
    s3bucket = json_input["s3bucket"]

    invalid_units_frame_keys = []
    invalid_units_max_deviation = []
    invalid_units_timestamps = []

    client = boto3.client("s3")
    for idx, imgss3key in enumerate(cropped_images_s3_keys):

        # Fetch image from S3

        # Would be some/bucket/prefix/file.jpg
        response = client.get_object(
            Bucket=s3bucket,
            Key=imgss3key,
        )
        bstr = response["Body"].read()

        # Save to file

        # Would be file.jpg
        fname = imgss3key.split("/")[-1]
        # Would be /tmp/file.jpg
        fpath = "/tmp/" + fname
        f = open(fpath, "w+b")
        f.write(bstr)
        f.close()
        print("fetched " + imgss3key + " to " + fpath)

        # Convolute & reduce it
        # Score kept simple
        # Can easily be swapped with bigger 3x3, ... weighted kernel;
        # eg. Gaussian to account for noisy pixels

        img = cv2.imread(fpath)  # stores as BGR
        grey = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        mx = 0.0
        for r in grey:
            for val in r:
                delta = 255 - val  # 1x1 value
                mx = max(mx, val)

        # Check whether valid unit
        if mx > MAX_DEVIATION:
            invalid_units_max_deviation.append(float(mx))
            invalid_units_frame_keys.append(imgss3key)
            # should be idx, but we only get one value??
            invalid_units_timestamps.append(cropped_images_timestamps[0])

    all_passed = len(invalid_units_frame_keys) == 0

    res = {
        "all_passed": all_passed,
        # Frames in which a defect is observable
        "invalid_units_frame_keys": invalid_units_frame_keys,
        # When those units were analyzed
        "invalid_units_timestamps": invalid_units_timestamps,
        "invalid_units_max_deviation": invalid_units_max_deviation,
        # Object storage keys of the frames ingested
        "ingested_frame_keys": cropped_images_s3_keys,
        "ingested_frame_timestamps": cropped_images_timestamps,
    }

    return res


# IBM wrapper
def main(args):
    res = ir_convolute_reduce(args)
    return res


def lambda_handler(event, context):
    # read in the args from the POST object
    json_input = json.loads(event["body"])
    res = ir_convolute_reduce(json_input)
    return {"statusCode": 200, "body": json.dumps(res)}


# Docker wrapper
if __name__ == "__main__":
    # read the json
    json_input = json.loads(open("jsonInput.json").read())
    result = ir_convolute_reduce(json_input)

    # write to std out
    print(json.dumps(result))
