import axios from 'axios';

export const axiosInstance = axios.create({});

export const isAxiosError = axios.isAxiosError;

export const makePostAPICall =
  <Body, Response>(endpoint: string) =>
  (body: Body): Promise<Response> =>
    axiosInstance.post<Response>(endpoint, body).then((res) => res.data);
