const { pub } = require('./snsutils')

/**
 * 
 * @param {{
 * batchId: string,
 * topicArn: string,
 * region: string,
 * trace?: string,
 * sampleIds: string[]
 * sampleTimestamps: Date[]
 * invalidSampleIds: string[],
 * invalidSampleTimestamps: Date[]
 * }} event 
 * @param {*} context 
 * @param {*} callback 
 */
exports.handler = async (event, context, callback) => {
  const batchId = event['batchId']
  const topicArn = event['topicArn']
  const region = event['region']
  const trace = event['trace']
  const sampleIds = event['sampleIds']
  const sampleTimestamps = event['sampleTimestamps']
  const invalidSampleIds = event['invalidSampleIds']
  const invalidSampleTimestamps = event['invalidSampleTimestamps']
  const loggedTimestamp = new Date()
  let msg = {
    message: 'BATCH_INVALID',
    batchId, 
    trace,
    sampleIds,
    sampleTimestamps,
    loggedTimestamp,
    passed: false 
  }
  msg = JSON.stringify(msg)
  // Ensure reporting succeeds as it's crucial here
  try {
    await pub(msg, topicArn, region)
    console.log("sent " + msg + " to SNS queue " + topicArn + " " + region)
  } catch(e) {
    console.error("Batch did not pass but could not report to Queue.", "Message: " + msg, "Logging Error: " + e)
  }
}
