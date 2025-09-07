import request from 'umi-request';
import { serverConfig } from '../../components/config/config.ts'
import { listParams,listData } from './data';

export async function userInfoAdd(params: {
  name: string;
  phone: string;
  id: string;
  address: string;
  position: string;
  descr: string;
}) {
  return request<{}[]>(`${serverConfig.baseUrl}/infoEntry/add`, {
    method: 'POST', 
    data: params, 
  });
}


export async function getInfoEntryList(params: listParams) {
  return request<{
    total: number;
    data: listData[];
  }[]>(`${serverConfig.baseUrl}/infoEntry/get`, { params });
}