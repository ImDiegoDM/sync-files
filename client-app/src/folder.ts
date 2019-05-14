const folderKey = 'folder'

export function getFolderUrl():string{
  return localStorage.getItem(folderKey);
}

export function saveFolderUrl(url:string){
  localStorage.setItem(folderKey,url);
}

export function clearFolder(){
  localStorage.removeItem(folderKey);
}