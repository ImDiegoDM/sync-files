import { create } from 'apisauce';

export const baseURL = 'http://localhost:8080';

export const api = create({
  baseURL,
});