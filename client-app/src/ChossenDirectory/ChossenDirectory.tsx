import * as React from 'react';

interface ChossenDirectoryProps{
  onChange:(event: React.ChangeEvent<HTMLInputElement>)=>void
}

export function ChossenDirectory(props:ChossenDirectoryProps){
  
  return <input type="file" onChange={props.onChange} webkitdirectory="true" />
}