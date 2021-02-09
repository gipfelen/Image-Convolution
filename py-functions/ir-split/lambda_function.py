# import sys
# import boto3 
# from moviepy.editor import VideoFileClip

def lambda_handler(event, context):

  s3bucket = event['s3bucket']
  desired_num_splits = event['desired_num_splits']
  s3prefix = event['s3prefix']
  
  # numSplits = event['numSplits']
  # s3bucket = event['s3bucket']
  # videos3key = event['videos3key']

  # # Get video from S3
  # s3 = boto3.resource('s3')
  # s3.meta.client.download_file(s3bucket, videos3key, '/tmp/video.mp4')

  # # Split it into parts, each of length (duration / numSplits)
  # clip = VideoFileClip("/tmp/video.mp4")
  # durationSec = clip.duration 
  # splitDuration = durationSec / numSplits 
  # print(durationSec)
  # for i in range(numSplits):
  #   _from = i * splitDuration
  #   _to = (i+1) * splitDuration 
  #   print(_from, _to)
  #   split = clip.subclip(_from, _to)
  #   # Save to HDD as 0.mp4, 1.mp4 ...
  #   split.write_videofile("/tmp" + str(i) + ".mp4")

  return {
    'batches': [ ['dogsofa.jpg'] ],
    'num_splits': 1
  }