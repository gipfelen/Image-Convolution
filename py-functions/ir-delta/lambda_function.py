import datetime 

def lambda_handler(event, context):
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
    'ingested_window_start_date':datetime.datetime.today(),
    'ingested_window_end_date':datetime.datetime.today(),
  }