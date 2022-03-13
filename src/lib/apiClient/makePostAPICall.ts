import axios from 'axios';

const axiosInstance = axios.create({});

export const makePostAPICall =
  <Body, Response>(endpoint: string) =>
  (body: Body): Promise<Response> =>
    axiosInstance.post<Response>(endpoint, body).then((res) => {
      console.log({ res });
      return res.data;
    });
