exports.handler = async (event) => {
  const invalid_units_frame_keys_batches = event['invalid_units_frame_keys_batches']
  const invalid_units_timestamps_batches = event['invalid_units_timestamps_batches']
  
  return {
    'average_deviation': 0.01
  }
}