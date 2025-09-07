import request from 'umi-request';
import { serverConfig } from '../../components/config/config.ts'
import { listData1 , listData2 } from './data';



export async function getNameList() {
  return request<{
    data: listData1[];
  }[]>(`${serverConfig.baseUrl}/purchaseInsurance/name`);
}

export async function getInsuranceList(params: {aids:number[]}) {
  return request<{
    data: listData2[];
  }[]>(`${serverConfig.baseUrl}/purchaseInsurance/insuranceGet`, { params });
}