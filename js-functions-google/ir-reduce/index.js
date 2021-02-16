exports['ir-reduce'] = async (req, resp) => {
  const invalid_units_frame_keys_batches = req.query.invalid_units_frame_keys_batches || req.body.invalid_units_frame_keys_batches
  const invalid_units_frame_timestamps_batches = req.query.invalid_units_frame_timestamps_batches || req.body.invalid_units_frame_timestamps_batches
  const ingested_frame_keys_batches = req.query.ingested_frame_keys_batches || req.body.ingested_frame_keys_batches
  const ingested_frame_timestamps_batches = req.query.ingested_frame_timestamps_batches || req.body.ingested_frame_timestamps_batches

  const averageDeviation = invalid_units_frame_keys_batches.length / ingested_frame_keys_batches.length 
  
  resp.json({
    'average_deviation': averageDeviation
  })
 
}