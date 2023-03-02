import fs from "fs";
import Jimp = require("jimp");
import * as path from "path";

export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      console.log(photo);

      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      console.log(error);

      reject(error);
    }
  });
}

export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

export async function readLocalFiles(): Promise<string[]> {
  const folderPath = path.join(__dirname, "tmp");

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(folderPath)) {
      reject(new Error("invalid path provided to read"));
    }
    const filesNames: string[] = [];

    fs.readdir(folderPath, (err, files) => {
      if (err) {
        return reject(err);
      }
      files.forEach((file) => {
        filesNames.push(path.join(folderPath, file));
      });
      return resolve(filesNames);
    });
  });
}
