const { pub } = require('./snsutils')

/**
 * 
 * @param {{
  * allPassed: boolean,
  * ingested_frame_keys: string[],
  * ingested_frame_timestamps: number[],
  * topic_arn: string,
  * region: string,
  * logged_timestamp: string
  * }} event 
  * @param {*} context 
  * @param {*} callback 
  */


//  'all_passed': True,
//  # Units that did not pass inspection
//  # In which images the defect is observable
//  'invalid_units_frame_keys': [],
//  # When those units were produced
//  'invalid_units_timestamps': [],
//  # Object storage keys of the image frames ingested
//  'ingested_frame_keys': cropped_images_s3_keys,
//  'ingested_frame_timestamps': cropped_images_timestamps

exports.handler = async (event, context, callback) => {
  // const ingested_frame_keys = event['ingested_frame_keys']
  // const ingested_frame_timestamps = event['ingested_frame_timestamps']

  // const topic_arn = event['topic_arn']
  // const region = event['region']
  // const logged_timestamp = new Date()
  // let msg = {
  //   all_passed: all_passed,
  //   ingested_frame_keys: ingested_frame_keys,
  //   ingested_frame_timestamps: ingested_frame_timestamps,
  //   logged_timestamp: logged_timestamp
  // }

  // msg = JSON.stringify(msg)
  // await pub(msg, topic_arn, region)
  // console.log("sent " + msg + " to SNS queue " + topic_arn + " " + region)
  return { }
}
