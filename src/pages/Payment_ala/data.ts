export type listData2 = {
   /**
     * 地址
     */
    address: string;
    /**
     * 科室
     */
    department: string;
    /**
     * 医生
     */
    doctor: string;
    /**
     * 身份证
     */
    id: string;
    /**
     * 姓名
     */
    name: string;
    /**
     * 电话
     */
    phone: string;
    /**
     * 挂单单号
     */
    registration: string;
  };


// 患者信息数据模型
export interface PatientInfo {
  name: string;
  idCard: string;
  address: string;
  phone: string;
}

// 挂号信息数据模型
export interface RegistrationInfo {
  registrationId: string;
  departmentName: string;
  doctorName: string;
  appointmentTime: string;
  description?: string;
}

// 缴费信息数据模型
export interface PaymentInfo {
  patient: PatientInfo;
  registration: RegistrationInfo;
  amount: number; // 缴费金额
  status: 'pending' | 'paid' | 'failed'; // 缴费状态
}

// 搜索请求参数
export interface SearchParams {
  idCard: string;
}

// API响应模型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}