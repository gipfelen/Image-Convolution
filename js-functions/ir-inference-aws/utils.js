
const AWS = require('aws-sdk')
const s3 = new AWS.S3();

/**
 * 
 * @param {*} bucket 
 * @param {*} key 
 * @returns {Buffer}
 */
function getS3(bucket, key) {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return s3.getObject(params)
    .promise()
    .then((s3obj) => s3obj.Body && Buffer.from(s3obj.Body))
    .catch(e => {
      console.log(`Key ${key} does not exist in ${bucket}`)
      throw e
    })
}

/**
 * 
 * @param {*} bucket 
 * @param {*} key 
 * @param {*} data 
 */
function putS3(bucket, key, data) {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data,
  };
  return s3.putObject(params)
    .promise();
}

module.exports = {
  getS3,
  putS3
}