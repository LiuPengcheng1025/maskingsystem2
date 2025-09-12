export type listParams = {
    current?: number;
    pageSize?: number;
  };

export type listData = {
    address: string;
    /**
     * قسم
     */
    department: string;
    /**
     * وصف المرض
     */
    description: string;
    /**
     * الدكتور
     */
    doctor: string;
    id: string;
    name: string;
    phone: string;
  };











// نموذج بيانات القسم
export interface Department {
  id: number;
  name: string;
}

// نموذج بيانات الدكتور
export interface Doctor {
  id: number;
  name: string;
  title: string;
  available: boolean;
}

// نموذج بيانات نموذج التسجيل
export interface RegistrationFormData {
  name: string;
  idCard: string;
  address: string;
  phone: string;
  department: number | '';
  doctor: number | '';
  description: string;
}

// نموذج رسائل الخطأ
export interface FormErrors {
  name?: string;
  idCard?: string;
  address?: string;
  phone?: string;
  department?: string;
  doctor?: string;
  description?: string;
}

// بيانات قسائم التجميل
export const departments: Department[] = [
  { id: 1, name: 'الطب العام' },
  { id: 2, name: 'الجراحة' },
  { id: 3, name: 'الطب الأطفال' },
  { id: 4, name: 'التوليد والنساء' },
  { id: 5, name: 'العيون' },
  { id: 6, name: 'الأنف والأذن والحنجرة' },
  { id: 7, name: 'طب الأسنان' },
  { id: 8, name: 'أمراض الجلد' },
  { id: 9, name: 'أمراض الأعصاب' },
  { id: 10, name: 'الطب النفسي' },
];

// بيانات دكاترة التجميل، بناءً على تصنيف القسم
export const doctorsByDepartment: Record<number, Doctor[]> = {
  1: [
    { id: 101, name: 'Zhang', title: 'طبيب رئيس', available: true },
    { id: 102, name: 'Li', title: 'طبيب نائب رئيس', available: true },
    { id: 103, name: 'Wang', title: 'طبيب متخصص', available: true },
  ],
  2: [
    { id: 201, name: 'Liu', title: 'طبيب رئيس', available: true },
    { id: 202, name: 'Chen', title: 'طبيب نائب رئيس', available: false },
    { id: 203, name: 'Yang', title: 'طبيب متخصص', available: true },
  ],
  3: [
    { id: 301, name: 'Huang', title: 'طبيب رئيس', available: true },
    { id: 302, name: 'Zhou', title: 'طبيب نائب رئيس', available: true },
  ],
  4: [
    { id: 401, name: 'Wu', title: 'طبيب رئيس', available: true },
    { id: 402, name: 'Zheng', title: 'طبيب نائب رئيس', available: true },
  ],
  5: [
    { id: 501, name: 'Zhu', title: 'طبيب رئيس', available: false },
    { id: 502, name: 'Qin', title: 'طبيب متخصص', available: true },
  ],
  6: [
    { id: 601, name: 'You', title: 'طبيب نائب رئيس', available: true },
    { id: 602, name: 'Xu', title: 'طبيب متخصص', available: true },
  ],
  7: [
    { id: 701, name: 'He', title: 'طبيب رئيس', available: true },
    { id: 702, name: 'Lyu', title: 'طبيب متخصص', available: true },
  ],
  8: [
    { id: 801, name: 'Shi', title: 'طبيب نائب رئيس', available: true },
    { id: 802, name: 'Zhang', title: 'طبيب متخصص', available: false },
  ],
  9: [
    { id: 901, name: 'Kong', title: 'طبيب رئيس', available: true },
    { id: 902, name: 'Cao', title: 'طبيب نائب رئيس', available: true },
  ],
  10: [
    { id: 1001, name: 'Yan', title: 'طبيب رئيس', available: true },
    { id: 1002, name: 'Hua', title: 'طبيب متخصص', available: true },
  ],
};

// نموذج معلمات طلب التسجيل
export interface RegistrationRequest {
  name: string;
  idCard: string;
  address: string;
  phone: string;
  departmentId: number;
  doctorId: number;
  description: string;
}

// نموذج استجابة التسجيل
export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
    appointmentTime: string;
  };
}