import { create } from 'apisauce';

const baseURL = 'http://localhost:8080';

export const api = create({
  baseURL,
});