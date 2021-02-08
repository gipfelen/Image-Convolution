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
  // const batch_id = event['batch_id']
  // const average_deviation = event['average_deviation']

  // const topicArn = event['topicArn']
  // const region = event['region']
  // const logged_timestamp = new Date()
  // let msg = {
  //   batch_id,
  //   average_deviation,
  //   logged_timestamp,
  //   passed: true,
  // }

  // msg = JSON.stringify(msg)
  // await pub(msg, topicArn, region)
  // console.log("sent " + msg + " to SNS queue " + topicArn + " " + region)
  return {}
}
