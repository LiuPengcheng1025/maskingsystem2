import { SearchParams, ApiResponse, PaymentInfo , listData2 } from './data';
import request from 'umi-request';
import { serverConfig } from '../../components/config/config.ts'





export async function getPayment({id:string}) {
  return request<{
    data: listData2[];
  }[]>(`${serverConfig.baseUrl}/registration/paymentGet`,);
}

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟数据 - 根据身份证号查询患者信息
export async function searchPaymentByIDCard(params: SearchParams): Promise<ApiResponse<PaymentInfo>> {
  try {
    // 模拟网络请求延迟
    await delay(800);
    
    // 这里使用模拟数据，实际项目中应该调用真实API
    // 根据不同的身份证号返回不同的模拟数据
    const mockPaymentInfo: PaymentInfo = {
      patient: {
        name: params.idCard === '110101199001011234' ? '张三' : '李四',
        idCard: params.idCard,
        address: params.idCard === '110101199001011234' ? '北京市海淀区中关村' : '上海市浦东新区陆家嘴',
        phone: params.idCard === '110101199001011234' ? '13800138001' : '13900139001'
      },
      registration: {
        registrationId: `REG${Date.now().toString().slice(-8)}`,
        departmentName: params.idCard === '110101199001011234' ? '内科' : '外科',
        doctorName: params.idCard === '110101199001011234' ? '张医生' : '李医生',
        appointmentTime: new Date(Date.now() + 86400000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        description: '常规体检'
      },
      amount: Math.floor(Math.random() * 500) + 100, // 100-600之间的随机金额
      status: 'pending'
    };
    
    // 如果输入特定的身份证号，模拟查询失败情况
    if (params.idCard === '000000000000000000') {
      return {
        success: false,
        message: '未找到该身份证号对应的挂号信息'
      };
    }
    
    return {
      success: true,
      message: '查询成功',
      data: mockPaymentInfo
    };
  } catch (error) {
    return {
      success: false,
      message: '查询失败，请稍后重试'
    };
  }
}

// 提交医保支付请求（模拟）
export async function submitMedicalInsurancePayment(params: { paymentId: string }): Promise<ApiResponse> {
  try {
    // 模拟网络请求延迟
    await delay(1000);
    
    // 模拟成功响应
    return {
      success: true,
      message: '支付请求已提交，请在医保系统完成支付'
    };
  } catch (error) {
    return {
      success: false,
      message: '支付请求失败，请稍后重试'
    };
  }
}