const { pub } = require('./snsutils')


exports['ir-log-batch-invalid'] = async (req, resp) => {
  const average_deviation = req.query.average_deviation || req.body.average_deviation
  const topic_arn = req.query.topic_arn || req.body.topic_arn
  const region = req.query.region || req.body.region
  const invalid_units_frame_keys_batches = req.query.invalid_units_frame_keys_batches || req.body.invalid_units_frame_keys_batches
  const invalid_units_frame_timestamps_batches = req.query.invalid_units_frame_timestamps_batches || req.body.invalid_units_frame_timestamps_batches
  const logged_timestamp = new Date()
  
  let msg = {
    average_deviation,
    logged_timestamp,
    invalid_units_frame_keys_batches,
    invalid_units_frame_timestamps_batches,
    batch_passed: false,
  }
  
  msg = JSON.stringify(msg)
  await pub(msg, topic_arn, region)
  console.log("sent " + msg + " to SNS queue " + topic_arn + " " + region)
  resp.json({ })
}


