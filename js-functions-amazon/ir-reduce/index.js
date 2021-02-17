exports.handler = async (event, context, callback) => {
  const invalid_units_frame_keys_batches = event['invalid_units_frame_keys_batches'] || []
  const invalid_units_frame_timestamps_batches = event['invalid_units_frame_timestamps_batches'] || []
  const ingested_frame_keys_batches = event['ingested_frame_keys_batches'] || []
  const ingested_frame_timestamps_batches = event['ingested_frame_timestamps_batches'] || []

  const averageDeviation = invalid_units_frame_keys_batches.length / ingested_frame_keys_batches.length 
  
  return {
    'average_deviation': averageDeviation
  }
}