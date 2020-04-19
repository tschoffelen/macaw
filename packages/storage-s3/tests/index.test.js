const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");

const storage = require("../src/index");

AWSMock.setSDKInstance(AWS);
AWSMock.mock("S3", "getObject", ({ Bucket, Key }, callback) => {
  if (Bucket === "test-bucket" && Key === "file.txt") {
    callback(null, { Body: new Buffer("Test file!\n") });
  }
  if (Bucket === "test-bucket" && Key === "empty.txt") {
    callback(null, { Body: new Buffer("") });
  }
  callback(new Error("File not found"));
});

test("throws if no bucket name specified", async () => {
  const fn = () => {
    storage();
  };

  await expect(fn).toThrow(/Invalid bucket name specified/);
});

test("returns promise on file read", () => {
  const instance = storage("test-bucket", {}, AWS);
  instance.setOptions({});

  expect(instance.getItem("file.txt")).toBeInstanceOf(Promise);
});

test("reads file with relative path", async () => {
  const instance = storage("test-bucket", {}, AWS);

  const data = await instance.getItem("file.txt");

  expect(data).toEqual("Test file!\n");
});

test("throw error if file does not exist", async () => {
  const instance = storage("test-bucket", {}, AWS);

  await expect(instance.getItem("random-file.md")).rejects.toThrow();
});

test("throw error if file is empty", async () => {
  const instance = storage("test-bucket", {}, AWS);

  await expect(instance.getItem("empty.txt")).rejects.toThrow();
});
