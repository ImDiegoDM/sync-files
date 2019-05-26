import * as React from 'react';
import { ApiResponse } from 'apisauce';

export interface EndPointConfig{
  endPointCall: (...args:any[])=>Promise<ApiResponse<any>>;
  args:any[]
}

export interface SuccessEndPoint<T = any>{
  data:T;
}

export interface ErrorEndPoint<T = any>{
  code:number;
  data: T;
}

export interface EndPointProps<S=any,E=any>{
  waiting:React.FC;
  error:React.FC<ErrorEndPoint<E>>;
  children:React.FC<SuccessEndPoint<S>>;
}

export function useEndPoint<S=any,E=any>({endPointCall,args}:EndPointConfig,refresh?:any[]): React.FC<EndPointProps<S,E>>{
  const [fetching,setFectching] = React.useState(true);
  const [data,setData] = React.useState<S|E|undefined>(undefined);
  const [ok,setOk] = React.useState(true);
  const [status,setStatus] = React.useState(undefined);

  React.useEffect(()=>{
    endPointCall(...args).then((response)=>{

      if(!response.ok){
        setOk(false);
      }

      setStatus(response.status);
      setData(response.data);
      setFectching(false);
    })
  },refresh || [])

  return (props:EndPointProps<S,E>)=>{
    if(fetching){
      return <>{props.waiting({})}</>
    }

    if(!ok){
      return <>{props.error({code:status,data:(data as E)})}</>
    }

    return <>
      {props.children({data:(data as S)})}
    </>
  }
}