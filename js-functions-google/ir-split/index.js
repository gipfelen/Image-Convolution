const AWS = require('aws-sdk')
const s3 = new AWS.S3()


exports['ir-split'] = async (req, resp) => {

  const s3bucket = req.query.s3bucket || req.body.s3bucket
  const desired_num_splits = req.query.desired_num_splits || req.body.desired_num_splits
  const s3prefix = req.query.s3prefix || req.body.s3prefix

  // List all images
  let files = await s3.listObjects({
    Bucket: s3bucket,
    Prefix: s3prefix
  })
    .promise()
    .then(res => res.Contents)

  imgkeys = files.map(k => k.Key)

  // Part into batches
  let batchSize = Math.ceil(imgkeys.length / desired_num_splits)
  let batches = []
  let currBatch = []
  for (let i = 0; i < imgkeys.length; i++) {
    // wrap up batch
    if (currBatch.length > batchSize) {
      batches.push(currBatch)
      currBatch = []
    }
    // append
    currBatch.push(imgkeys[i])
  }
  // append last batch
  batches.push(currBatch)

  const numBatches = batches.length

  resp.json({
    num_batches: numBatches,
    batches: batches
  })
}
}
