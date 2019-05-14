import * as React from 'react';
import { File } from './components/File';
import { Box } from '../Common'
import { useEndPoint, ErrorEndPoint } from '../Common/hooks/useEndPoint';
import { api } from '../api';

interface Hash{
  [key:string]: {
    subItens:Hash|null;
    checksum:string;
  }
}

function Waiting(){
  return <h3>Loading...</h3>
}

function Error(props:ErrorEndPoint) {
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

export function Synchronizer(){
  const Api = useEndPoint<Hash>({endPointCall:api.get('/hash')})

  return <Box wrap="wrap">
    <Api waiting={Waiting} error={Error}>
      {(props)=>{
        console.log(props)
        return <HashToFiles hash={props.data}/>
      }}
    </Api>
  </Box>
}