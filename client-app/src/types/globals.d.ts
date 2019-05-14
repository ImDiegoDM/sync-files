interface FS{
  readdir:(path:string,callback:(err:Error,files:string[])=>void)=>void;
}

interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly path: string;
}