import { remote } from "electron";
import { getFolderUrl } from "../../folder";
import { DowloadFile } from "./DowloadFile";
import { existsFile } from "./existsFile";
import { Publish } from "../../events";
import { fileChannel, FileActions } from "../../file";
import { HashFile } from "./hash";
import { api } from '../../api';

export interface HashItem{
  checksum?: string;
  subItens?: HashItems;
}

export interface HashItems{
  [key:string]:HashItem
}

export interface WrongFiles{
  [key:string]:boolean|WrongFiles
}

const fs:any = remote.require('fs');

export async function getAndCheckHash(){
  const hashFiles = (await api.get<HashItems>('/hash')).data;
  checkFiles(hashFiles);
}

export const syncedFiles = {}

// Compare the files in the selected folder with the hash
// recived from the api, if a file or a folder is not find
// the file or folder is downloaded or created
export async function checkFiles(hash:HashItems,path=''){
  console.log('checking files')
  const errors = undefined;
  const folder = getFolderUrl();

  for (const fileName in hash) {
    if (hash.hasOwnProperty(fileName)) {

      const element = hash[fileName];
      const relativePath = path !== '' ? `${path}\\${fileName}`:`${fileName}`;
      const filePath = `${folder}\\${relativePath}`;
      syncedFiles[fileName] = false;

      if(!existsFile(relativePath)){
        if(element.subItens !== null){
          fs.mkdirSync(filePath);
          checkFiles(element.subItens,relativePath);
          continue;
        }

        DowloadFile(fileName,path);
      }
      else{
        if(element.subItens !== null){
          checkFiles(element.subItens,relativePath);
          continue;
        }
  
        const digest = await HashFile(filePath);
        if(digest!==element.checksum){
          DowloadFile(fileName,path);
          continue;
        }

        syncedFiles[fileName] = true;
        Publish(fileChannel,FileActions.synced,{name:fileName})
      }

    }
  }

  return errors;
}