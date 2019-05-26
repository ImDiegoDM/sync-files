import { remote } from "electron";
import { getFolderUrl } from "../../folder";

const fs:any = remote.require('fs');
const crypto:any = remote.require('crypto');


export function HashFile(url:string){
  return new Promise((res,rej)=>{
    
    const hash:any = crypto.createHash('sha256');

    hash.on('readable',()=>{
      const data = hash.read();
      if(data){
        res(data.toString('hex'));
        return
      }

      rej('error hashing file')
    });

    const file = fs.readFileSync(url);
    hash.write(file);
    hash.end();
  });
}