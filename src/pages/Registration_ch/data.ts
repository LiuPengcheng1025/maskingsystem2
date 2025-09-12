export type listParams = {
    current?: number;
    pageSize?: number;
  };

export type listData = {
    address: string;
    /**
     * 科室
     */
    department: string;
    /**
     * 病情描述
     */
    description: string;
    /**
     * 医生
     */
    doctor: string;
    id: string;
    name: string;
    phone: string;
  };











// 科室数据模型
export interface Department {
  id: number;
  name: string;
}

// 医生数据模型
export interface Doctor {
  id: number;
  name: string;
  title: string;
  available: boolean;
}

// 挂号表单数据模型
export interface RegistrationFormData {
  name: string;
  idCard: string;
  address: string;
  phone: string;
  department: number | '';
  doctor: number | '';
  description: string;
}

// 错误信息模型
export interface FormErrors {
  name?: string;
  idCard?: string;
  address?: string;
  phone?: string;
  department?: string;
  doctor?: string;
  description?: string;
}

// 模拟科室数据
export const departments: Department[] = [
  { id: 1, name: '内科' },
  { id: 2, name: '外科' },
  { id: 3, name: '儿科' },
  { id: 4, name: '妇产科' },
  { id: 5, name: '眼科' },
  { id: 6, name: '耳鼻喉科' },
  { id: 7, name: '口腔科' },
  { id: 8, name: '皮肤科' },
  { id: 9, name: '神经内科' },
  { id: 10, name: '精神科' },
];

// 模拟医生数据，根据科室筛选
export const doctorsByDepartment: Record<number, Doctor[]> = {
  1: [
    { id: 101, name: '张医生', title: '主任医师', available: true },
    { id: 102, name: '李医生', title: '副主任医师', available: true },
    { id: 103, name: '王医生', title: '主治医师', available: true },
  ],
  2: [
    { id: 201, name: '刘医生', title: '主任医师', available: true },
    { id: 202, name: '陈医生', title: '副主任医师', available: false },
    { id: 203, name: '杨医生', title: '主治医师', available: true },
  ],
  3: [
    { id: 301, name: '黄医生', title: '主任医师', available: true },
    { id: 302, name: '周医生', title: '副主任医师', available: true },
  ],
  4: [
    { id: 401, name: '吴医生', title: '主任医师', available: true },
    { id: 402, name: '郑医生', title: '副主任医师', available: true },
  ],
  5: [
    { id: 501, name: '朱医生', title: '主任医师', available: false },
    { id: 502, name: '秦医生', title: '主治医师', available: true },
  ],
  6: [
    { id: 601, name: '尤医生', title: '副主任医师', available: true },
    { id: 602, name: '徐医生', title: '主治医师', available: true },
  ],
  7: [
    { id: 701, name: '何医生', title: '主任医师', available: true },
    { id: 702, name: '吕医生', title: '主治医师', available: true },
  ],
  8: [
    { id: 801, name: '施医生', title: '副主任医师', available: true },
    { id: 802, name: '张医生', title: '主治医师', available: false },
  ],
  9: [
    { id: 901, name: '孔医生', title: '主任医师', available: true },
    { id: 902, name: '曹医生', title: '副主任医师', available: true },
  ],
  10: [
    { id: 1001, name: '严医生', title: '主任医师', available: true },
    { id: 1002, name: '华医生', title: '主治医师', available: true },
  ],
};

// 提交挂号请求参数模型
export interface RegistrationRequest {
  name: string;
  idCard: string;
  address: string;
  phone: string;
  departmentId: number;
  doctorId: number;
  description: string;
}

// 挂号响应模型
export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
    appointmentTime: string;
  };
}