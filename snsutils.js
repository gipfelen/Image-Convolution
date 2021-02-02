const AWS = require('aws-sdk')
/**
 * 
 * @param {string} message 
 * @param {string} topic 
 */
function pub(message, topicArn, region) {
  const sns = new AWS.SNS({
    region
  })
  const params = {
    Message: message,
    TopicArn: topicArn
  }
  const res = await sns.publish(params).promise()

  return res;
}

module.exports = {
  pub
}