import datetime 

def lambda_handler(event, context):

  cropped_images_s3_keys = event['cropped_images_s3_keys']
  cropped_images_timestamps = event['cropped_images_timestamps']
  s3bucket = event['s3bucket']

  return {
    'all_passed': True,
    # Units that did not pass inspection
    # In which images the defect is observable
    'invalid_units_frame_keys': [],
    # When those units were produced
    'invalid_units_timestamps': [],
    # Object storage keys of the image frames ingested
    'ingested_frame_keys': ['a.jpg','b.jpg'],
    # The time window for which this function did QA
    # For instance, if frames were from between Aug 15 00:00:00 - 00:00:15
    # That would be start_date and end_date
    'ingested_window_start_date_millis':datetime.datetime.today(), # TODO to millis
    'ingested_window_end_date_millis':datetime.datetime.today(), # TODO to millis
  }