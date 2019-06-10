import * as React from 'react';
import { File,Filetype } from './components/File';
import { Box } from '../Common'
import { ErrorEndPoint, useEndPoint } from '../Common/hooks/useEndPoint';
import { remote } from 'electron';
import { usePromise, PromiseError } from '../Common/hooks/usePromise';
import { getFolderUrl } from '../folder';
import { api } from '../api';
import { checkFiles, HashItems } from '../Common/utils/checkFiles';
import { Subscribe, UnSubscribe } from '../events';
import { fileChannel, FileActions } from '../file';

const fs:any = remote.require('fs');
const path:any = remote.require('path');

interface Hash{
  [key:string]: {
    subItens:Hash|null;
    checksum:string;
  }
}

function Waiting(){
  return <h3>Loading...</h3>
}

function Error(props:ErrorEndPoint|PromiseError) {
  console.log(props);
  return <h3>Opps.. it seems an error has ocurred</h3>
}

interface HashToFilesProps{
  hash:Hash
}

function HashToFiles({hash}:HashToFilesProps){
  return <>
    {Object.keys(hash).map(key=>{
      const obj = hash[key];
      if(obj.subItens !== null){
        return <HashToFiles key={key} hash={obj.subItens}/>
      }

      return <File key={key} name={key}/>
    })}
  </>
}

interface DiskOBJ {
  name:string;
  type: Filetype;
}

function ReadDir(dirPath:string):Promise<DiskOBJ[]>{
  return new Promise((res,rej)=>{
    fs.readdir(dirPath,(err,files)=>{
      if(err){
        rej(err)
        return;
      };

      res(files.map((file)=>{
        return {
          name:file,
          type:fs.lstatSync(path.join(dirPath,file)).isDirectory() ? 'folder':'file'
        }
      }))
    });
  })
}

interface RenderFilesProps{
  files:DiskOBJ[];
  onOpenFolder?:(folderName:string)=>void
}

function RenderFiles(props:RenderFilesProps){
  return <>
    {props.files.map((file)=><File key={file.name} onDoubleClick={()=>{
      if(file.type === 'folder'){
        props.onOpenFolder(file.name);
      }
    }} name={file.name} type={file.type}/>)}
  </>
}

export function Synchronizer(){
  const id = 'synchronizer';
  const folder = getFolderUrl();

  const [refresh,setRefresh] = React.useState(0);
  const [filePath,setPath] = React.useState('');

  const Files = usePromise({promise:ReadDir, args:[folder+filePath]},[filePath]);

  React.useEffect(()=>{
    Subscribe(fileChannel,id,(message)=>{
      switch (message) {
        case FileActions.add:
        case FileActions.remove:
          setRefresh(refresh+1);
          console.log('recived action')
          break;
      }
    })
    return()=>{
      console.log("remove")
      UnSubscribe(fileChannel,id);
    }
  });

  return <Box wrap="wrap">
    <Files waiting={Waiting} error={Error}>
      {(props)=>{
        console.log(props.data)
        return <RenderFiles onOpenFolder={(folderName)=>{
          setPath(path.join(filePath,folderName));
        }} files={props.data}/>
      }}
    </Files>
  </Box>
}