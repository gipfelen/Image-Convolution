import datetime 

def lambda_handler(event, context):

  cropped_images_s3_keys = event['cropped_images_s3_keys']
  cropped_images_timestamps = event['cropped_images_timestamps']
  s3bucket = event['s3bucket']

  return {
    'all_passed': True,
    # Frames in which a defect is observable
    'invalid_units_frame_keys': [],
    # When those units were produced
    'invalid_units_timestamps': [],
    # Object storage keys of the frames ingested
    'ingested_frame_keys': cropped_images_s3_keys,
    'ingested_frame_timestamps': cropped_images_timestamps,
  }