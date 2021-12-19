import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Injectable } from '../../decorators';
import { HttpClient } from '../../models/interfaces/http-client.interface';

@Injectable()
export class HttpService implements HttpClient {
  request<T>(options: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios
      .request<T>(options)
      .then((data) => data)
      .catch((error) => {
        throw new Error(error);
      });
  }
}
