import { baseURL } from "../../api";
import { remote } from "electron";

const http:HTTP = remote.require('http');


export function HttpGetPromisse(endpoint: string): Promise<any> {
  return new Promise((res, rej) => {
    http.get(baseURL + endpoint, (response) => {
      res(response);
    });
  });
}