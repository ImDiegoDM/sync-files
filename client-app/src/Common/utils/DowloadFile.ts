import { getFolderUrl } from "../../folder";
import { HttpGetPromisse } from "./HttpGetPromisse";
import { remote } from "electron";
import { Publish } from "../../events";
import { fileChannel, FileActions } from "../../file";
import { syncedFiles } from "./checkFiles";
import { log } from "../../Logs";

const fs:any = remote.require('fs');
const path:any = remote.require('path');

export async function DowloadFile(fileName: string,folderPath: string='') {
  const folder = getFolderUrl();
  const relativePath = folderPath !== '' ? path.join(folderPath,fileName):path.join(fileName); 
  const filePath = path.join(folder,relativePath);

  const response = await HttpGetPromisse(`/download/${relativePath}`);
  
  const file = fs.createWriteStream(filePath);
  response.pipe(file);
  log(`File ${fileName} was downloaded successfully`);
  syncedFiles[fileName] = true;
  Publish(fileChannel,FileActions.add,{name:fileName});
}