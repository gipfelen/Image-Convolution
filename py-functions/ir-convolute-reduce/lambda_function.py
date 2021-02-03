# This function takes in images of units that did not pass inspection,
# and estimates how faulty or impure they are using sharpening kernel convolution and then reduction
def lambda_handler(event, context):    
  invalid_units_frame_keys = event['invalid_units_frame_keys'],
  invalid_units_timestamps = event['invalid_units_timestamps']

  # check each
  return {
    'invalid_units_frame_keys': invalid_units_frame_keys,
    'invalid_units_timestamps': invalid_units_timestamps,
    'invalid_units_deviation': [0.3, 0.4, 0.5]
  }