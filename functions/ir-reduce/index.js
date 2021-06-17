async function processComment(params) {
  const body = params;

  const invalid_units_frame_keys_batches = body['invalid_units_frame_keys_batches'] || []
  //const invalid_units_frame_timestamps_batches = body['invalid_units_frame_timestamps_batches'] || []
  const ingested_frame_keys_batches = body['ingested_frame_keys_batches'] || []
  //const ingested_frame_timestamps_batches = body['ingested_frame_timestamps_batches'] || []

  const averageDeviation = invalid_units_frame_keys_batches.length / ingested_frame_keys_batches.length 
  
  const response = {
    average_deviation: averageDeviation
  };

  return response;
}

//AWS CALL
exports.handler = async (event) => {  
  const body = JSON.parse(event.body);
  result = await processComment(body)
  return {
    statusCode: 200,
    body: JSON.stringify({
      average_deviation: result.average_deviation,
    }),
  };
};

//IBM
exports.main = processComment;
