import React, { useState, useRef } from 'react';
import { Form, Input, Button, Card, message, Modal, Select, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { departments, doctorsByDepartment } from './data.ts';
import { submitRegistration } from './service.ts';
import './index.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Registration = () => {
  // 创建表单引用
  const formRef = useRef(null);
  
  // 表单状态管理
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    address: '',
    phone: '',
    department: '',
    doctor: '',
    description: '',
  });
  
  // 错误状态管理
  const [errors, setErrors] = useState({});
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  // 挂号成功弹窗状态
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  
  // 成功信息
  const [successInfo, setSuccessInfo] = useState({ registrationId: '', appointmentTime: '' });
  
  // 添加渐变按钮样式
  const useStyle = createStyles(({ prefixCls, css }) => ({
    linearGradientButton: css`
      &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
        > span { position: relative; }
        &::before { content: ''; background: linear-gradient(135deg, #6253e1, #04befe); position: absolute; inset: -1px; opacity: 1; transition: all .3s; border-radius: inherit; }
        &:hover::before { opacity: 0; }
      }
    `,
  }));
  
  const { styles } = useStyle();
  
  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误提示
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // 处理选择框变化
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 如果切换科室，重置医生选择
    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        doctor: ''
      }));
    }
    
    // 清除对应字段的错误提示
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors = {};
    
    // 姓名验证
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }
    
    // 身份证验证
    if (!formData.idCard.trim()) {
      newErrors.idCard = '请输入身份证号';
    } else if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.idCard)) {
      newErrors.idCard = '请输入有效的身份证号';
    }
    
    // 地址验证
    if (!formData.address.trim()) {
      newErrors.address = '请输入地址';
    }
    
    // 电话验证
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入电话号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }
    
    // 科室选择验证
    if (!formData.department) {
      newErrors.department = '请选择科室';
    }
    
    // 医生选择验证
    if (!formData.doctor) {
      newErrors.doctor = '请选择医生';
    }
    
    // 描述验证（可选，但有长度限制）
    if (formData.description && formData.description.length > 500) {
      newErrors.description = '病情描述不能超过500字';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 处理挂号提交
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await submitRegistration({
        name: formData.name,
        idCard: formData.idCard,
        address: formData.address,
        phone: formData.phone,
        departmentId: formData.department,
        doctorId: formData.doctor,
        description: formData.description,
      });
      
      if (result.success) {
        message.success('挂号成功！');
        setSuccessInfo({
          registrationId: result.data?.registrationId || '',
          appointmentTime: result.data?.appointmentTime || '',
        });
        setIsSuccessModalVisible(true);
        
        // 重置表单
        formRef.current?.resetFields();
        setFormData({
          name: '',
          idCard: '',
          address: '',
          phone: '',
          department: '',
          doctor: '',
          description: '',
        });
      } else {
        message.error(result.message || '挂号失败，请稍后重试');
      }
    } catch (error) {
      message.error('挂号失败，请稍后重试');
      console.error('挂号提交错误:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 关闭成功弹窗
  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
  };
  
  // 根据选择的科室获取医生列表
  const getDoctors = () => {
    return formData.department ? doctorsByDepartment[formData.department] || [] : [];
  };
  
  return (
    <div className="registration-container">
      <Card className="registration-card">
        <Title level={2} className="registration-title">医院挂号系统</Title>
        
        <Form ref={formRef} layout="vertical">
          <div className="form-section">
            <Title level={4}>个人信息</Title>
            <div className="form-row">
              <Form.Item label="姓名" validateStatus={errors.name ? 'error' : ''} help={errors.name}>
                <Input
                  placeholder="请输入您的姓名"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </Form.Item>
              
              <Form.Item label="身份证号" validateStatus={errors.idCard ? 'error' : ''} help={errors.idCard}>
                <Input
                  placeholder="请输入您的身份证号"
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  className="form-input"
                />
              </Form.Item>
            </div>
            
            <div className="form-row">
              <Form.Item label="联系电话" validateStatus={errors.phone ? 'error' : ''} help={errors.phone}>
                <Input
                  placeholder="请输入您的手机号码"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </Form.Item>
              
              <Form.Item label="地址" validateStatus={errors.address ? 'error' : ''} help={errors.address}>
                <Input
                  placeholder="请输入您的居住地址"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                />
              </Form.Item>
            </div>
          </div>
          
          <div className="form-section">
            <Title level={4}>挂号信息</Title>
            <div className="form-row">
              <Form.Item label="科室" validateStatus={errors.department ? 'error' : ''} help={errors.department}>
                <Select
                  placeholder="请选择科室"
                  value={formData.department}
                  onChange={(value) => handleSelectChange('department', value)}
                  className="form-select"
                >
                  {departments.map(dept => (
                    <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item label="医生" validateStatus={errors.doctor ? 'error' : ''} help={errors.doctor}>
                <Select
                  placeholder="请选择医生"
                  value={formData.doctor}
                  onChange={(value) => handleSelectChange('doctor', value)}
                  disabled={!formData.department}
                  className="form-select"
                >
                  {getDoctors().map(doctor => (
                    <Option
                      key={doctor.id}
                      value={doctor.id}
                      disabled={!doctor.available}
                    >
                      {doctor.name} - {doctor.title}
                      {!doctor.available && ' (已满)'}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            
            <Form.Item label="病情描述（选填）" validateStatus={errors.description ? 'error' : ''} help={errors.description}>
  <Input.TextArea
    placeholder="请简要描述您的病情（可选）"
    name="description"
    value={formData.description}
    onChange={handleChange}
    rows={4}
    maxLength={500}
    showCount
    className="form-textarea"
  />
</Form.Item>
          </div>
          
          <Button
  type="primary"
  className={`${styles.linearGradientButton} submit-button`}
  onClick={handleSubmit}
  loading={loading}
  size="large"
  block
>
  提交挂号
</Button>
        </Form>
      </Card>
      
      {/* 挂号成功弹窗 */}
      <Modal
        title="挂号成功"
        open={isSuccessModalVisible}
        onOk={handleSuccessModalClose}
        onCancel={handleSuccessModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleSuccessModalClose}>
            确定
          </Button>
        ]}
      >
        <div className="success-content">
          <p>恭喜您，挂号成功！</p>
          {successInfo.registrationId && (
            <p>挂号单号：{successInfo.registrationId}</p>
          )}
          {successInfo.appointmentTime && (
            <p>预约时间：{successInfo.appointmentTime}</p>
          )}
          <p>请按时前往医院就诊。</p>
        </div>
      </Modal>
    </div>
  );
};

export default Registration;