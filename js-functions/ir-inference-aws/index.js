const AWS = require('aws-sdk')
const { getS3 } = require('./utils')

const rekog = new AWS.Rekognition()

exports.handler = (event, context) => {

  // get images of this batch
  const imageS3Keys = event['imageS3Keys']
  const s3bucket = event['s3bucket']
  const bufs = await Promise.all(
    imageS3Keys.map(imgS3Key => getS3(s3bucket, imgS3Key))
  )

  // submit all to AWS Rekognition for label detection
  const results = await Promise.all(
    bufs.map(buf => {
      const params = {
        Image: {
          Bytes: buf
        },
        MaxLabels: 10,
        MinConfidence: 60
      }

      return rekog.detectLabels(params)
    })
  )

  console.log(results)
}