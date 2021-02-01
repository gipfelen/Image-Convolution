import cv2 
import boto3 

H = 225
W = 225

def lambda_handler(event, context): 
  s3bucket = event['s3bucket']
  imgss3keys = event['imgss3keys']

  # Each image
  client = boto3.client('s3')
  for imgss3key in imgss3keys:

    # Fetch image from S3

    # Would be some/bucket/prefix/file.jpg
    response = client.get_object(
      Bucket=s3bucket,
      Key=imgss3key,
    )
    bstr = response['Body'].read()

    # Save to file 
    
    # Would be some/bucket/prefix/
    prefix = "".join(imgss3key.split("/")[0:-1]) + "/"
    # Would be file.jpg
    fname = imgss3key.split("/")[-1]
    fpath = "/tmp/" + fname 
    f = open(fpath, 'w+b')
    f.write(bstr)
    f.close()
    print("fetched " + imgss3key + " to " + fpath)

    # Preprocess it

    img = cv2.imread(fpath)
    # Crop to relevant part of image
    xcenter = img.shape[1] / 2
    x = xcenter - (W / 2)
    ycenter = img.shape[0] / 2
    y = ycenter - (H / 2)
    crop_img = img[int(y):int(y+H), int(x):int(x+W)]
    print("cropped image to shape ", crop_img.shape)
    
    # Save cropped to file 

    #   croppedkey = 
    croppedfpath = '/tmp/' + "cropped-" + fname 
    cv2.imwrite(croppedfpath, crop_img)

    print("wrote cropped img to " + croppedfpath)

lambda_handler({ 's3bucket': 'jak-bridge-typical', 'imgss3keys': [ 'dogsofa.jpg']} ,None)