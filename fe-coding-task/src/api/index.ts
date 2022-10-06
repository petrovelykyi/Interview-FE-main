import axios, { AxiosError, AxiosResponse } from 'axios';
import { RequestBody, ResponseData } from '../types';

const fetchData = async (url: string, body: RequestBody): Promise<AxiosResponse<ResponseData> | AxiosError> => {
  try {
    return await axios.post<ResponseData>(url, body);
  } catch (e) {
    return e as AxiosError;
  }
};

export { fetchData };
