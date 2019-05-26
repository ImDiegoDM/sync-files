import * as React from 'react';
import styled from 'styled-components';
import { Box } from '../../Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faFolder, faSync, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '../../Common/Icon';
import { remote } from 'electron';
import { Subscribe,UnSubscribe } from '../../events';
import { fileChannel, FileActions } from '../../file';
import { syncedFiles } from "../../Common/utils/checkFiles";

const fs:any = remote.require('fs');

const Container = styled(Box)`
  border-radius: 5px;
  box-shadow: 0 0 8px 0px #b5b5b5;
  margin: 20px;
  position: relative;
  -webkit-user-select: none;
  &:hover{
    box-shadow: 0 0 8px 0px #0e80b7;
    cursor: pointer;
  }
`;

const FileName = styled.p`
  margin: 0;
  text-overflow: ellipsis;
  width:80%;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
`;

interface FileProps{
  name:string;
  type?:Filetype;
  onDoubleClick?:()=>void;
}

export type Filetype = 'file'|'folder';

const SyncIcon = styled(FontAwesomeIcon)`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

export function File(props:FileProps){
  const size="150px";
  const timeToDoubleClick = 300;

  const [synced,setSynced] = React.useState(syncedFiles[props.name]);
  const [doubleClick,setDoubleClick] = React.useState(false);

  React.useEffect(()=>{
    if(props.type === 'file'){
      Subscribe(fileChannel,'file-'+props.name,(message,payload)=>{
        if ((message === FileActions.synced || message === FileActions.add) && payload.name === props.name){
          setSynced(true);
        }
      })
  
      return ()=>{
        UnSubscribe(fileChannel,'file-'+props.name);
      }
    }
  })

  return <Container width={size} 
    direction="column" 
    height={size} 
    justifyContent="center" 
    alignItems="center"
    onClick={(event)=>{
      event.stopPropagation();
      event.preventDefault();
      if(doubleClick){

        props.onDoubleClick();
        setDoubleClick(false);
        return
      }

      setDoubleClick(true);
      setTimeout(()=>{
        setDoubleClick(false);
      },timeToDoubleClick);
    }}
  >
    <Icon>
      <FontAwesomeIcon icon={props.type === 'file' ? faFileAlt: faFolder} size="2x"/>
    </Icon>
    {props.type === 'file' && <>
      {synced ? <SyncIcon  icon={faCheck} />:<SyncIcon  icon={faSync} spin />}
    </>}
    <FileName>{props.name}</FileName>
  </Container>
}