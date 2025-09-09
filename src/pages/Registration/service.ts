import { RegistrationRequest, RegistrationResponse } from './data';


import request from 'umi-request';
import { serverConfig } from '../../components/config/config.ts'
import { listParams,listData } from './data';


export async function userInfoAdd(params: {
  name: string;
  phone: string;
  id: string;
  address: string;
  department: string;
  doctor: string;
  description: string;
  registration:string;
}) {
  return request<{}[]>(`${serverConfig.baseUrl}/registration/add`, {
    method: 'POST', 
    data: params, 
  });
}



export async function getInfoEntryList(params: listParams) {
  return request<{
    total: number;
    data: listData[];
  }[]>(`${serverConfig.baseUrl}/registration/get`, { params });
}


// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 提交挂号请求
export async function submitRegistration(params: RegistrationRequest): Promise<RegistrationResponse> {
  try {
    // 模拟网络请求延迟
    await delay(1000);
    
    // 生成随机挂号单号
    const registrationId = `REG${Date.now().toString().slice(-8)}`;
    
    // 生成预约时间（当前时间+1-3天）
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 3) + 1);
    
    const hours = 8 + Math.floor(Math.random() * 6); // 8:00-14:00之间的随机时间
    const minutes = Math.floor(Math.random() * 2) * 30; // 0或30分钟
    appointmentDate.setHours(hours, minutes, 0, 0);
    
    const appointmentTime = appointmentDate.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // 返回成功响应
    return {
      success: true,
      message: '挂号成功',
      data: {
        registrationId,
        appointmentTime
      }
    };
  } catch (error) {
    // 模拟错误情况
    return {
      success: false,
      message: '提交失败，请稍后重试'
    };
  }
}

// 获取科室列表（备用函数）
export async function getDepartmentsList() {
  try {
    await delay(500);
    // 实际项目中这里会调用真实的API获取科室列表
    return {
      success: true,
      data: []
    };
  } catch (error) {
    return {
      success: false,
      message: '获取科室列表失败'
    };
  }
}