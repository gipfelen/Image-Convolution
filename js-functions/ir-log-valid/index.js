const { pub } = require('./snsutils')

/**
 * 
 * @param {{
  * sampleId: string,
  * topicArn: string,
  * region: string,
  * sampleTimestamp: Date
  * }} event 
  * @param {*} context 
  * @param {*} callback 
  */
exports.handler = async (event, context, callback) => {
  const sampleId = event['sampleId']
  const topicArn = event['topicArn']
  const region = event['region']
  const sampleTimestamp = event['sampleTimestamp']
  const loggedTimestamp = new Date()
  let msg = {
    message: 'UNIT_VALID',
    sampleId: sampleId,
    sampleTimestamp: sampleTimestamp,
    loggedTimestamp: loggedTimestamp,
    passed: true
  }
  msg = JSON.stringify(msg)
  await pub(msg, topicArn, region)
  console.log("sent " + msg + " to SNS queue " + topicArn + " " + region)
}
