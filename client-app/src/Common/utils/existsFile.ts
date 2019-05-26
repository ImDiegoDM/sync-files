import { getFolderUrl } from "../../folder";
import { remote } from "electron";

const fs:FS = remote.require('fs');

export function existsFile(file: string) {
  const folder = getFolderUrl();
  return fs.existsSync(folder + '\\' + file);
}