import * as React from 'react';
import * as moment from 'moment';
import styled from 'styled-components';
import { Publish, Subscribe, UnSubscribe } from '../events';

const logs=[];

export const logChannel='logs';

export enum LogAction{
  logUpdate = 'logUpdate'
}

export function log(message:string){
  logs.push(message);
  Publish(logChannel,LogAction.logUpdate);
}

function getDate():string{
  return moment().format();
}

const LogsContainer = styled.div`
  border-radius: 10px;
  height: 140px;
  border: solid #b7b7b7 2px;
  overflow: auto;
  padding: 0 10px;
`

export function Logs(){
  const id='Logs';
  const [internalLogs,setInternalLogs] = React.useState([...logs]);

  React.useEffect(()=>{
    setInternalLogs([...logs])
  },[])

  React.useEffect(()=>{
    Subscribe(logChannel,id,(message)=>{
      if(message === LogAction.logUpdate){
        setInternalLogs([...logs])
      }
    });

    return ()=>{
      UnSubscribe(logChannel,id);
    }
  })

  return <>
    <h4>Logs:</h4>
    <LogsContainer>
      {internalLogs.map((log,index)=><p key={index}>{getDate()}: {log}</p>)}
    </LogsContainer>
  </>
}