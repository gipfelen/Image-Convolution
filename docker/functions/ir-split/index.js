const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  const s3bucket = body["s3bucket"];
  const desired_num_splits = body["desired_num_splits"];
  const s3prefix = body["s3prefix"];

  // List all images
  let files = await s3
    .listObjects({
      Bucket: s3bucket,
      Prefix: s3prefix,
    })
    .promise()
    .then((res) => res.Contents);

  imgkeys = files.map((k) => k.Key);

  // Part into batches
  let batchSize = Math.ceil(imgkeys.length / desired_num_splits);
  let batches = [];
  let currBatch = [];
  for (let i = 0; i < imgkeys.length; i++) {
    // wrap up batch
    if (currBatch.length > batchSize) {
      batches.push(currBatch);
      currBatch = [];
    }
    // append
    currBatch.push(imgkeys[i]);
  }
  // append last batch
  batches.push(currBatch);

  const numBatches = batches.length;


  return JSON.stringify({
    num_batches: numBatches,
    batches: batches,
  });
};
