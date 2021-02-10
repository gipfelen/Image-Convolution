exports.handler = async (event, context, callback) => {
  const invalid_units_frame_keys_batches = event['invalid_units_frame_keys_batches']
  const invalid_units_frame_timestamps_batches = event['invalid_units_frame_timestamps_batches']
  const ingested_frame_keys_batches = event['ingested_frame_keys_batches']
  const ingested_frame_timestamps_batches = event['ingested_frame_timestamps_batches']

  
  return {
    'average_deviation': 0.01
  }
}