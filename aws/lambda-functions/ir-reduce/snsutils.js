const AWS = require('aws-sdk')
/**
 * 
 * @param {string} message 
 * @param {string} topic 
 */
async function pub(message, topic_arn, region) {
  const sns = new AWS.SNS({
    region
  })
  const params = {
    Message: message,
    topic_arn: topic_arn
  }
  const res = await sns.publish(params).promise()

  return res;
}

module.exports = {
  pub
}