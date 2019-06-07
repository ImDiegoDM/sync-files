import { remote } from "electron";
import { getFolderUrl } from "../../folder";
import { DowloadFile } from "./DowloadFile";
import { existsFile } from "./existsFile";
import { Publish } from "../../events";
import { fileChannel, FileActions } from "../../file";
import { HashFile } from "./hash";
import { api } from '../../api';
import { log } from "../../Logs";

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
  const apiResponse = await api.get<HashItems>('/hash');
  console.log(apiResponse)
  if(apiResponse.ok === false){
    log('Api comunication failed')
    return
  }

  log('Getted hash from api')
  log('Starting to check files...');
  checkFiles(apiResponse.data);
}

export const syncedFiles = {}

// Compare the files in the selected folder with the hash
// recived from the api, if a file or a folder is not find
// the file or folder is downloaded or created
export async function checkFiles(hash:HashItems,path=''){
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
          log(`Folder ${fileName} not found`);
          fs.mkdirSync(filePath);
          log(`Created ${fileName} folder`);
          await checkFiles(element.subItens,relativePath);
          continue;
        }

        log(`File ${fileName} not founded, downloading ${fileName} from the api...`);
        DowloadFile(fileName,path);
      }
      else{
        if(element.subItens !== null){
          await checkFiles(element.subItens,relativePath);
          continue;
        }
        
        const digest = await HashFile(filePath);
        if(digest!==element.checksum){
          log(`File ${fileName} is not the same from the api, updating ${fileName}...`);
          DowloadFile(fileName,path);
          continue;
        }

        syncedFiles[fileName] = true;
        Publish(fileChannel,FileActions.synced,{name:fileName});
      }

    }
  }

  return errors;
}