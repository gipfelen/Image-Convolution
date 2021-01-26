import sys
import boto3 
from moviepy.editor import VideoFileClip

def lambda_handler(event, context):
  numSplits = event['numSplits']
  videos3key = event['videos3key']

  s3client = boto3.client('s3')
  # s3: get
  clip = VideoFileClip("/tmp/in.mp4")
  durationSec = clip.duration 
  splitDuration = durationSec / numSplits 

  print(durationSec)
  for i in range(numSplits):
    _from = i * splitDuration
    _to = (i+1) * splitDuration 
    print(_from, _to)
    split = clip.subclip(_from, _to)
    split.write_videofile("/tmp" + str(i) + ".mp4")

