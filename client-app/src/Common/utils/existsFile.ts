import { getFolderUrl } from "../../folder";
import { remote } from "electron";

const fs:any = remote.require('fs');
const path:any = remote.require('path');

export function existsFile(file: string) {
  const folder = getFolderUrl();

  return fs.existsSync(path.join(folder, file));
}