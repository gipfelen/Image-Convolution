import cv2
import boto3
import json
import sys
import os


# The center 410 x 410 px of each frame should be inspected
# This cuts out bezels, or elements of industrial holding trays at the edge
# See folder datasets/... to see which images will be fed into this function
H = 410
W = 410


def preprocess_imgs(json_input,client):
    imgss3keys = json_input["images_s3_keys"]
    s3bucket = json_input["s3bucket"]
    # # Each image
    croppedimgss3keys = []
    for imgss3key in imgss3keys:

        # Fetch image from S3

        # Would be some/bucket/prefix/file.jpg
        response = client.get_object(
            Bucket=s3bucket,
            Key=imgss3key,
        )
        bstr = response["Body"].read()

        # Save to file

        # Would be some/bucket/prefix/
        prefix = "".join(imgss3key.split("/")[0:-1]) + "/"
        # Would be file.jpg
        fname = imgss3key.split("/")[-1]
        fpath = "/tmp/" + fname
        f = open(fpath, "w+b")
        f.write(bstr)
        f.close()
        # print("fetched " + imgss3key + " to " + fpath)

        # Preprocess it

        img = cv2.imread(fpath)
        # Crop to relevant part of image
        xcenter = img.shape[1] / 2
        x = xcenter - (W / 2)
        ycenter = img.shape[0] / 2
        y = ycenter - (H / 2)
        crop_img = img[int(y) : int(y + H), int(x) : int(x + W)]
        # print("cropped image to shape ", crop_img.shape)

        # Save cropped to file

        #   croppedkey =
        croppedfname = "cropped-" + fname
        croppedfpath = "/tmp/" + croppedfname
        cv2.imwrite(croppedfpath, crop_img)

        # print("wrote cropped img to " + croppedfpath)

        # Stash back to S3
        croppedfkey = prefix + croppedfname
        cf = open(croppedfpath, "r+b")
        response = client.put_object(Bucket=s3bucket, Key=croppedfkey, Body=cf)
        # print("stashed cropped img to s3 as ", croppedfkey)

        croppedimgss3keys.append(croppedfkey)

    res = {
        "cropped_images_s3_keys": croppedimgss3keys,
        "cropped_images_timestamps": [16000000],
    }

    return res


# IBM wrapper
def main(args):
    client = boto3.client(
        's3',
        aws_access_key_id=credentials['accessKeyId'],
        aws_secret_access_key=credentials['secretAccessKey'],
    )
    res = preprocess_imgs(args,client)
    return res


def lambda_handler(event, context):
    client = boto3.client("s3")

    # read in the args from the POST object
    json_input = json.loads(event["body"])
    res = preprocess_imgs(json_input,client)
    return {"statusCode": 200, "body": json.dumps(res)}


# Docker wrapper
if __name__ == "__main__":
    client = boto3.client("s3")

    # read the json
    json_input = json.loads(open("jsonInput.json").read())
    result = preprocess_imgs(json_input, client)

    # write to std out
    print(json.dumps(result))
