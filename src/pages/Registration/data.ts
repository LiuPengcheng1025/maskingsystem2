export type listParams = {
    current?: number;
    pageSize?: number;
  };

export type listData = {
    address: string;
    /**
     * 备注
     */
    descr: string;
    id: string;
    name: string;
    phone: string;
    /**
     * 职位
     */
    position: string;
    [property: string]: any;
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
  { id: 1, name: 'Internal Medicine' },
  { id: 2, name: 'Surgery' },
  { id: 3, name: 'Pediatrics' },
  { id: 4, name: 'Obstetrics & Gynecology' },
  { id: 5, name: 'Ophthalmology' },
  { id: 6, name: 'Otolaryngology' },
  { id: 7, name: 'Dentistry' },
  { id: 8, name: 'Dermatology' },
  { id: 9, name: 'Neurology' },
  { id: 10, name: 'Psychiatry' },
];

// 模拟医生数据，根据科室筛选
export const doctorsByDepartment: Record<number, Doctor[]> = {
  1: [
    { id: 101, name: 'Dr. Zhang', title: 'Chief Physician', available: true },
    { id: 102, name: 'Dr. Li', title: 'Associate Chief Physician', available: true },
    { id: 103, name: 'Dr. Wang', title: 'Attending Physician', available: true },
  ],
  2: [
    { id: 201, name: 'Dr. Liu', title: 'Chief Physician', available: true },
    { id: 202, name: 'Dr. Chen', title: 'Associate Chief Physician', available: false },
    { id: 203, name: 'Dr. Yang', title: 'Attending Physician', available: true },
  ],
  3: [
    { id: 301, name: 'Dr. Huang', title: 'Chief Physician', available: true },
    { id: 302, name: 'Dr. Zhou', title: 'Associate Chief Physician', available: true },
  ],
  4: [
    { id: 401, name: 'Dr. Wu', title: 'Chief Physician', available: true },
    { id: 402, name: 'Dr. Zheng', title: 'Associate Chief Physician', available: true },
  ],
  5: [
    { id: 501, name: 'Dr. Zhu', title: 'Chief Physician', available: false },
    { id: 502, name: 'Dr. Qin', title: 'Attending Physician', available: true },
  ],
  6: [
    { id: 601, name: 'Dr. You', title: 'Associate Chief Physician', available: true },
    { id: 602, name: 'Dr. Xu', title: 'Attending Physician', available: true },
  ],
  7: [
    { id: 701, name: 'Dr. He', title: 'Chief Physician', available: true },
    { id: 702, name: 'Dr. Lyu', title: 'Attending Physician', available: true },
  ],
  8: [
    { id: 801, name: 'Dr. Shi', title: 'Associate Chief Physician', available: true },
    { id: 802, name: 'Dr. Zhang', title: 'Attending Physician', available: false },
  ],
  9: [
    { id: 901, name: 'Dr. Kong', title: 'Chief Physician', available: true },
    { id: 902, name: 'Dr. Cao', title: 'Associate Chief Physician', available: true },
  ],
  10: [
    { id: 1001, name: 'Dr. Yan', title: 'Chief Physician', available: true },
    { id: 1002, name: 'Dr. Hua', title: 'Attending Physician', available: true },
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