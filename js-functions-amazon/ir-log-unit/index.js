const { pub } = require('./snsutils')


exports.handler = async (event, context, callback) => {
  const all_passed = event['all_passed']
  const invalid_units_frame_keys = event['invalid_units_frame_keys']
  const invalid_units_timestamps = event['invalid_units_timestamps']
  const ingested_frame_keys = event['ingested_frame_keys']
  const ingested_frame_timestamps = event['ingested_frame_timestamps']
  const topic_arn = event['topic_arn']
  const region = event['region']
    
  const logged_timestamp = new Date()

  let msg = {
    all_passed,
    logged_timestamp,
    invalid_units_frame_keys,
    invalid_units_timestamps,
    ingested_frame_keys,
    ingested_frame_timestamps,
  }

  msg = JSON.stringify(msg)
  try {
    await pub(msg, topic_arn, region)
    console.log("sent " + msg + " to SNS queue " + topic_arn + " " + region)
  } catch(e) {
    console.error("Unit did not pass but could not report to Queue.", "Message: " + msg, "Logging Error: " + e)
    throw e
  }

  return {}
}
