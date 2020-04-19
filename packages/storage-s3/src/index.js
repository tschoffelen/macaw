const AWS = require("aws-sdk");

module.exports = (bucketName, s3Options = undefined, aws = AWS) => {
  if (!bucketName) {
    throw new Error("Invalid bucket name specified.");
  }

  const s3 = new aws.S3(s3Options);

  const getItem = async fileName => {
    const params = {
      Bucket: bucketName,
      Key: fileName
    };

    const data = await s3.getObject(params).promise();
    const contents = data.Body.toString();

    if (!contents) {
      throw new Error(`File is empty: ${fileName}.`);
    }

    return contents;
  };

  return {
    setOptions: _ => {},
    getItem
  };
};
