exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  const invalid_units_frame_keys_batches = body['invalid_units_frame_keys_batches'] || []
  //const invalid_units_frame_timestamps_batches = body['invalid_units_frame_timestamps_batches'] || []
  const ingested_frame_keys_batches = body['ingested_frame_keys_batches'] || []
  //const ingested_frame_timestamps_batches = body['ingested_frame_timestamps_batches'] || []

  const averageDeviation = invalid_units_frame_keys_batches.length / ingested_frame_keys_batches.length 


  return JSON.stringify({
    average_deviation: averageDeviation
  });
}