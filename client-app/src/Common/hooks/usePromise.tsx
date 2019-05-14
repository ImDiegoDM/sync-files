import * as React from 'react';

export interface PromiseConfig<T>{
  promise: Promise<T>;
}

export interface PromiseSuccess<T = any>{
  data:T;
}

export interface PromiseError<T = any>{
  error: T;
}

export interface PromiseProps<S=any,E=any>{
  waiting:React.FC;
  error:React.FC<PromiseError<E>>;
  children:React.FC<PromiseSuccess<S>>;
}

export function usePromise<S=any>({promise}:PromiseConfig<S>): React.FC<PromiseProps<S>>{
  const [loading,setLoading] = React.useState(true);
  const [data,setData] = React.useState<S|undefined>(undefined);
  const [error,setError] = React.useState(false);

  React.useEffect(()=>{
    promise.then((response)=>{
      setData(response);
      setLoading(false);
    }).catch((err)=>{
      setData(err);
      setError(true);
      setLoading(false);
    })
  },[])

  return (props:PromiseProps<S>)=>{
    if(loading){
      return <>{props.waiting({})}</>
    }

    if(error){
      return <>{props.error({error:(data as any)})}</>
    }

    return <>
      {props.children({data:(data as S)})}
    </>
  }
}