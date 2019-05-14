import * as React from 'react';
import { File } from './components/File';
import { Box } from '../Common'
import { useEndPoint, ErrorEndPoint } from '../Common/hooks/useEndPoint';
import { api } from '../api';
import { remote } from 'electron';
import { usePromise, PromiseError } from '../Common/hooks/usePromise';
import { getFolderUrl } from '../folder';

const fs:FS = remote.require('fs');

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

function ReadDir(path:string):Promise<string[]>{
  return new Promise((res,rej)=>{
    fs.readdir(path,(err,files)=>{
      if(err){
        rej(err)
        return;
      };

      res(files)
    });
  })
}

interface RenderFilesProps{
  files:string[]
}

function RenderFiles(props:RenderFilesProps){
  return <>
    {props.files.map((file)=><File key={file} name={file}/>)}
  </>
}

export function Synchronizer(){
  // const Api = useEndPoint<Hash>({endPointCall:api.get('/hash')});

  const Files = usePromise({promise:ReadDir(getFolderUrl())})

  React.useEffect(()=>{

  },[])

  return <Box wrap="wrap">
    <Files waiting={Waiting} error={Error}>
      {(props)=>{
        console.log(props)
        return <RenderFiles files={props.data}/>
      }}
    </Files>
  </Box>
}