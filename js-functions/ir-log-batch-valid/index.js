const { pub } = require('./snsutils')

/**
 * 
 * @param {{
 * batchId: string,
 * topicArn: string,
 * region: string,
 * sampleIds: string[]
 * sampleTimestamps: Date[]
 * }} event 
 * @param {*} context 
 * @param {*} callback 
 */
exports.handler = async (event, context, callback) => {
  const batchId = event['batchId']
  const topicArn = event['topicArn']
  const region = event['region']
  const sampleIds = event['sampleIds']
  const sampleTimestamps = event['sampleTimestamps']
  const loggedTimestamp = new Date()
  let msg = {
    message: 'BATCH_VALID',
    batchId,
    sampleIds,
    sampleTimestamps,
    loggedTimestamp,
    passed: true
  }
  msg = JSON.stringify(msg)
  // save cloudwatch space
  await pub(msg, topicArn, region)
}
