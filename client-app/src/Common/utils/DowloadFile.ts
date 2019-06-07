import { getFolderUrl } from "../../folder";
import { HttpGetPromisse } from "./HttpGetPromisse";
import { remote } from "electron";
import { Publish } from "../../events";
import { fileChannel, FileActions } from "../../file";
import { syncedFiles } from "./checkFiles";
import { log } from "../../Logs";

const fs:any = remote.require('fs');

export async function DowloadFile(fileName: string,path: string='') {
  const folder = getFolderUrl();
  const relativePath = path !== '' ? `${path}\\${fileName}`:`${fileName}`; 
  const filePath =`${folder}\\${relativePath}`;

  const response = await HttpGetPromisse(`/download/${relativePath}`);
  
  const file = fs.createWriteStream(filePath);
  response.pipe(file);
  log(`File ${fileName} was downloaded successfully`);
  syncedFiles[fileName] = true;
  Publish(fileChannel,FileActions.add,{name:fileName});
}