const { pub } = require('./snsutils')

/**
 * 
 * @param {{
 * sampleId: string,
 * topicArn: string,
 * region: string,
 * trace?: string,
 * sampleTimestamp: Date
 * }} event 
 * @param {*} context 
 * @param {*} callback 
 */
exports.handler = async (event, context, callback) => {
  const sampleId = event['sampleId']
  const topicArn = event['topicArn']
  const region = event['region']
  const trace = event['trace']
  const sampleTimestamp = event['sampleTimestamp']
  const loggedTimestamp = new Date()
  let msg = {
    message: "UNIT_INVALID",
    sampleId: sampleId,
    sampleTimestamp: sampleTimestamp,
    loggedTimestamp: loggedTimestamp,
    passed: false,
    trace: trace
  }
  msg = JSON.stringify(msg)
  // Ensure reporting succeeds as it's crucial here
  try {
    await pub(msg, topicArn, region)
    console.log("sent " + msg + " to SNS queue " + topicArn + " " + region)
  } catch(e) {
    console.error("Unit did not pass but could not report to Queue.", "Message: " + msg, "Logging Error: " + e)
  }
}
