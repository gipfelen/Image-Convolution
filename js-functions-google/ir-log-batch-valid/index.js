const { pub } = require('./snsutils')

/**
 * 
 * @param {{ average_deviation: number, topic_arn: string, region: string }} param0 
 * @param {*} context 
 * @param {*} callback 
 */
exports['ir-log-batch-valid'] = async (req, resp) => {
  
  const average_deviation = req.query.average_deviation || req.body.average_deviation
  const topic_arn = req.query.topic_arn || req.body.topic_arn
  const region = req.query.region || req.body.region 
  
  const logged_timestamp = new Date()
  let msg = {
    average_deviation,
    logged_timestamp,
    batch_passed: true,
  }

  msg = JSON.stringify(msg)
  await pub(msg, topic_arn, region)
  console.log("sent " + msg + " to SNS queue " + topic_arn + " " + region)
  resp.json({ })
}
