const fs = require("fs");
const path = require("path");

module.exports = () => {
  let options = {
    templatesDirectory: "emails"
  };

  const setOptions = opt => {
    options = { ...options, ...opt };
    options.templatesDirectory = path.resolve(options.templatesDirectory);

    if (!fs.existsSync(options.templatesDirectory)) {
      throw Error(
        `Templates directory does not exist: ${options.templatesDirectory}`
      );
    }
  };

  const getItem = async fileName =>
    new Promise((resolve, reject) => {
      const pathName =
        fileName.indexOf("/") === 0
          ? fileName
          : path.join(options.templatesDirectory, fileName);

      fs.readFile(pathName, "utf8", (err, contents) => {
        if (err) {
          return reject(err);
        }

        if (!contents) {
          return reject(new Error(`File is empty: ${fileName}.`));
        }

        resolve(contents);
      });
    });

  return {
    setOptions,
    getItem
  };
};
