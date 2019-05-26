import { Publish } from "./events";

const folderKey = 'folder';

export const folderChannel = 'folder';

export enum FolderActions{
  setFolder = 'setFolder',
  clearFolder = 'clearFolder'
}

export function getFolderUrl():string{
  return localStorage.getItem(folderKey);
}

export function saveFolderUrl(url:string){
  Publish(folderChannel,FolderActions.setFolder,url);
  localStorage.setItem(folderKey,url);
}

export function clearFolder(){
  Publish(folderChannel,FolderActions.clearFolder);
  localStorage.removeItem(folderKey);
}