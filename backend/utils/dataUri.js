import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

export const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString(); // get the extension name of the file
  return parser.format(extName, file.buffer).content; // parse the file and return the content
};
