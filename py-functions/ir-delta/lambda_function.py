import datetime 

def lambda_handler(event, context):

  cropped_images_s3_keys = event['cropped_images_s3_keys']
  # in unix epoch millis
  cropped_images_timestamps = event['cropped_images_timestamps']
  #s3bucket = event['s3bucket']

  return {
    'all_passed': True,
    # Units that did not pass inspection
    # In which images the defect is observable
    'invalid_units_frame_keys': [],
    # When those units were produced
    'invalid_units_timestamps': [],
    # Object storage keys of the image frames ingested
    'ingested_frame_keys': cropped_images_s3_keys,
    'ingested_frame_timestamps': cropped_images_timestamps
  }