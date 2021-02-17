import datetime 
import cv2 
import boto3
import numpy as np  

MAX_DEVIATION = 5

def lambda_handler(event, context):

  cropped_images_s3_keys = event['cropped_images_s3_keys']
  cropped_images_timestamps = event['cropped_images_timestamps']
  s3bucket = event['s3bucket']


  invalid_units_frame_keys = []
  invalid_units_max_deviation = []
  invalid_units_timestamps = []

  client = boto3.client('s3')
  for idx, imgss3key in enumerate(cropped_images_s3_keys):

    # Fetch image from S3

    # Would be some/bucket/prefix/file.jpg
    response = client.get_object(
      Bucket=s3bucket,
      Key=imgss3key,
    )
    bstr = response['Body'].read()

    # Save to file 
    
    # Would be file.jpg
    fname = imgss3key.split("/")[-1]
    # Would be /tmp/file.jpg
    fpath = "/tmp/" + fname 
    f = open(fpath, 'w+b')
    f.write(bstr)
    f.close()
    print("fetched " + imgss3key + " to " + fpath)

    # Convolute & reduce it
    # Score kept simple
    # Can easily be swapped with bigger 3x3, ... weighted kernel; 
    # eg. Gaussian to account for noisy pixels

    img = cv2.imread(fpath) # stores as BGR
    grey = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    mx = 0.0
    for r in grey:
      for val in r: 
        delta = 255 - val # 1x1 value
        mx = max(mx, val)

    # Check whether valid unit
    if(mx > MAX_DEVIATION):
      invalid_units_deviation.append(mx)
      invalid_units_frame_keys.append(imgss3key)
      invalid_units_timestamps.append(cropped_images_timestamps[idx])
    
  all_passed = (len(invalid_units_frame_keys) == 0)

  return {
    'all_passed': all_passed,
    # Frames in which a defect is observable
    'invalid_units_frame_keys': invalid_units_frame_keys,
    # When those units were analyzed
    'invalid_units_timestamps': invalid_units_timestamps,
    'invalid_units_max_deviation': invalid_units_max_deviation,
    # Object storage keys of the frames ingested
    'ingested_frame_keys': cropped_images_s3_keys,
    'ingested_frame_timestamps': cropped_images_timestamps,
  }


