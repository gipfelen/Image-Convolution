const AWS = require('aws-sdk')
const { getS3 } = require('./utils')


exports.handler = async (event, context) => {

  const imageS3Keys = event['imageS3Keys']
  const s3bucket = event['s3bucket']
  const region = event['region']
  
  const rekog = new AWS.Rekognition({
    region: region
  })

  // get images of this batch as Buffers
  const bufs = await Promise.all(
    imageS3Keys.map(imgS3Key => getS3(s3bucket, imgS3Key))
  )

  // submit all to AWS Rekognition for label detection
  let results = await Promise.all(
    bufs.map(buf => {
      const params = {
        Image: {
          Bytes: buf
        },
        MaxLabels: 10,
        MinConfidence: 60
      }

      return rekog.detectLabels(params).promise()
    })
  )

  results = JSON.stringify(results, null, 2)

  return {
    predictions: results
  }
}
