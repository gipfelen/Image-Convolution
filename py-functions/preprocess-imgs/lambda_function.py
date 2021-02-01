import cv2 
import boto3 

def lambda_handler(event, context): 
  s3bucket = event['s3bucket']
  imgss3keys = event['imgss3keys']

  # Let's use Amazon S3
  client = boto3.client('s3')
  for imgss3key in imgss3keys:
    response = client.get_object(
      Bucket=s3bucket,
      Key=imgss3key,
    )
    bstr = response['Body'].read()
    # save to file 
    fname = imgss3key.split(":")[-1]
    f = open('/tmp/' + fname, 'w+b')
    f.write(bstr)
    f.close()
    print("fetched " + imgss3key + " to " + '/tmp/' + fname)


lambda_handler({ 's3bucket': 'jak-bridge-typical', 'imgss3keys': [ 'dogsofa.jpg']} ,None)