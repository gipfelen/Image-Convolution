const { pub } = require('./snsutils')

/**
 * 
 * @param {body: {
  * ingested_frame_keys: string[],
  * ingested_frame_timestamps: number[],
  * invalid_units_keys: string[],
  * invalid_units_timestamps: string[],
  * topic_arn: string,
  * region: string,
  * }} req Express req object
  */

exports['ir-log-invalid'] = async (req, resp) => {
  const ingested_frame_keys = req.query.ingested_frame_keys || req.body.ingested_frame_keys
  const ingested_frame_timestamps = req.query.ingested_frame_timestamps || req.body.ingested_frame_timestamps
  const invalid_units_frame_keys = req.query.invalid_units_frame_keys || req.body.invalid_units_frame_keys
  const invalid_units_timestamps = req.query.invalid_units_timestamps || req.body.invalid_units_timestamps

  const topic_arn = req.query.topic_arn || req.body.topic_arn
  const region = req.query.region || req.body.region
  
  const all_passed = false
  const logged_timestamp = new Date()
  let msg = {
    all_passed,
    ingested_frame_keys,
    ingested_frame_timestamps,
    invalid_units_frame_keys,
    invalid_units_timestamps,
    logged_timestamp
  }

  msg = JSON.stringify(msg)
  await pub(msg, topic_arn, region)
  console.log("sent " + msg + " to SNS queue " + topic_arn + " " + region)
  
  resp.json({ })
}
