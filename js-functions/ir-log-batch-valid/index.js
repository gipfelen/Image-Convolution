const { pub } = require('./snsutils')

/**
 * 
 * @param {{ average_deviation: number, topic_arn: string, region: string }} param0 
 * @param {*} context 
 * @param {*} callback 
 */
exports.handler = async ({ average_deviation, topic_arn, region }, context, callback) => {
  
  const logged_timestamp = new Date()
  let msg = {
    average_deviation,
    logged_timestamp,
    batch_passed: true,
  }

  msg = JSON.stringify(msg)
  await pub(msg, topic_arn, region)
  console.log("sent " + msg + " to SNS queue " + topic_arn + " " + region)
  return {}
}
