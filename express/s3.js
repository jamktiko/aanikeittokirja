require('dotenv').config();
const aws = require('aws-sdk');
const crypto = require('crypto');
//const promisify = require('util');
const util = require('util');
const randomBytes = util.promisify(crypto.randomBytes);

const region = 'eu-west-1';
const bucketName = 'reseptipankki-images';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

// Generoi uniikin osoitteen kuvan lisäykselle
// ja palauttaa kyseisen osoitteen (fronttiin)
async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex');

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
}

module.exports = generateUploadURL;
