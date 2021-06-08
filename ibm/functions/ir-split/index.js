const AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
const s3 = new AWS.S3();


async function processComment(params) {
  const body = params

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

  const response = {
    num_batches: numBatches,
    batches: batches,
  };
  return response;
};

exports.main = processComment;


// global.main = myAction;
// exports.main = myAction;



// // main({
// //   "s3bucket": "terraform-bucket-image-convolution",
// //   "s3prefix": "200",
// //   "desired_num_splits": 2
// // }).then(function (returnValue){
// //   console.log(returnValue)
// // })