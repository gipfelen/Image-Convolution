const { pub } = require('./snsutils')


exports.handler = async (event, context, callback) => {
  // const allPassed = event['allPassed']
  // const ingested_frame_keys = event['ingested_frame_keys']
  // const ingested_frame_timestamps = event['ingested_frame_timestamps']
  // const invalid_units_timestamps = event['invalid_units_timestamps']
  // const invalid_units_frame_keys = event['invalid_units_frame_keys']
  
  // const topicArn = event['topicArn']
  // const region = event['region']
  // const logged_timestamp = new Date()
  // let msg = {
  //   allPassed: allPassed,
  //   ingested_frame_keys: ingested_frame_keys,
  //   ingested_frame_timestamps: ingested_frame_timestamps,
  //   logged_timestamp: logged_timestamp
  // }

  // msg = JSON.stringify(msg)
  // try {
  //   await pub(msg, topicArn, region)
  //   console.log("sent " + msg + " to SNS queue " + topicArn + " " + region)
  // } catch(e) {
  //   console.error("Unit did not pass but could not report to Queue.", "Message: " + msg, "Logging Error: " + e)
  // }
}
