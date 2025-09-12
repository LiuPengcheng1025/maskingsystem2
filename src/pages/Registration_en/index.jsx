import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { Form, Input, Button, Card, message, Modal, Select, Typography , Table} from 'antd';
import { createStyles } from 'antd-style';
import { departments, doctorsByDepartment } from './data.ts';
import { submitRegistration } from './service.ts';
import './index.css';
import { getInfoEntryList  , userInfoAdd } from './service.ts';


const { Title, Text } = Typography;
const { Option } = Select;

const Registration = () => {
  // 添加状态管理
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // 修改pageSize的初始值为5
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  // 获取表格数据
  const fetchTableData = async () => {
  try {
    const response = await getInfoEntryList({
      current: currentPage,
      pageSize: pageSize
    });
    console.log(currentPage,pageSize,response);
    // 确保dataSource始终是数组
    const tableData = response.data.data;
    setTotal(response.data.total);
    // const tableData = Array.isArray(response.data) ? response.data : [];
    console.log(tableData);

    setDataSource(tableData);
  } catch (error) {
    console.error('获取表格数据失败:', error);
    // 错误时也确保dataSource是数组
    setDataSource([]);
    setTotal(0);
  }
};
   // 初始加载和分页变化时获取数据
  useEffect(() => {
    fetchTableData();
  }, [currentPage, pageSize]);





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
      newErrors.name = 'Please enter your full name';
    }
    
    // 身份证验证
    if (!formData.idCard.trim()) {
      newErrors.idCard = 'Please enter your ID card number';
    } else if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.idCard)) {
      newErrors.idCard = 'Please enter a valid ID card number';
    }
    
    // 地址验证
    if (!formData.address.trim()) {
      newErrors.address = 'Please enter your address';
    }
    
    // 电话验证
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // 科室选择验证
    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }
    
    // 医生选择验证
    if (!formData.doctor) {
      newErrors.doctor = 'Please select a doctor';
    }
    
    // 描述验证（可选，但有长度限制）
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Medical description cannot exceed 500 characters';
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
        description: formData.description
      });
      
      
      if (result.success) {
        message.success('Registration successful!');
        setSuccessInfo({
          registrationId: result.data?.registrationId || '',
          appointmentTime: result.data?.appointmentTime || '',
        });
        setIsSuccessModalVisible(true);
        
        // 在控制台打印用户信息和挂号单号
        console.log('用户提交的信息:', {
          name: formData.name,
          idCard: formData.idCard,
          address: formData.address,
          phone: formData.phone,
          department: formData.department,
          doctor: formData.doctor,
          description: formData.description,
          registrationId: result.data?.registrationId || '',
        });
        
        // 调用userInfoAdd接口
        try {
          const params = {
            name: formData.name,
            phone: formData.phone,
            id: formData.idCard,
            address: formData.address,
            department: formData.department,
            doctor: formData.doctor,
            description: formData.description,
            registration: result.data?.registrationId || '',
          };
          console.log('userInfoAdd接口调用参数:', params);
          const addResult = await userInfoAdd(params);
          console.log('userInfoAdd接口调用结果:', addResult);
          // 由于接口可能返回不同格式的数据，这里进行安全的访问
          if (addResult && addResult.data) {
            console.log('挂号结果数据:', addResult.data);
          }
        } catch (error) {
          console.error('调用userInfoAdd接口失败:', error);
        }
        
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
        message.error(result.message || 'Registration failed, please try again later');
      }
    } catch (error) {
      message.error('Registration failed, please try again later');
      console.error('Registration submission error:', error);
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


  // 使用 useState 管理卡片显示状态
  const [showFirstCard, setShowFirstCard] = useState(true);

  // 使用 useState 管理卡片的图片路径和文字内容
  const [cardText, setCardText] = useState('go to Application Database');

  // 使用 useState 管理页面标题
  const [pageTitle, setPageTitle] = useState('Employee Information Entry System');

  // 处理第二个卡片点击事件
  const handleSecondCardClick = () => {
    setShowFirstCard(!showFirstCard);
    
    // 切换图片和文字内容
    if (showFirstCard) {
      formRef.current.resetFields();
      setCardText('Return to Add Info');
      // 切换标题为员工数据库
      setPageTitle('Employee Database');
      // 调用接口获取最新数据列表
      fetchTableData();
    } else {
      setCardText('go to Application Database');
      // 切换回原标题
      setPageTitle('Employee Information Entry System');
    }
  };

  // 使用 useState 管理卡片的缩放状态
  const [isCardHovered, setIsCardHovered] = useState(false);
  // 处理卡片鼠标进入事件
  const handleCardMouseEnter = () => {
    setIsCardHovered(true);
  };

  // 处理卡片鼠标离开事件
  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
  };
  
   const [selectedWebsite, setSelectedWebsite] = useState(null);
   const handleWebsiteChange = (value) => {
  // 不再更新selectedWebsite状态，这样placeholder会一直显示
  // 根据选择的值打开相应的网站
  switch (value) {
    case 'website1':
      window.open('https://46d35c013d33.ngrok-free.app/inspect?username=admin&password=123456', '_blank');
      break;
    case 'website2':
      window.open('https://9aafb966a954.ngrok-free.app/inspect?username=admin&password=123456', '_blank');
      break;
    case 'website3':
      window.open('https://b8363f9e5916.ngrok-free.app/inspect?username=admin&password=123456', '_blank');
      break;
    default:
      break;
  }
};
   return (
    <div className="registration-container">
      {/* 添加右上角定位容器 */}
      <div style={{ position: 'absolute', top: 30, right: 50, zIndex: 1000 }}>
        <Button type="primary" size="large"
          variant={false}
          onClick={handleSecondCardClick} 
          // 绑定鼠标进入和离开事件
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          // 根据状态添加类名
          className={isCardHovered ? 'card-hovered' : ''} 
          style={{
            width: '225px',
            right: 50,
            // height:35,
          }}
      >
        {cardText}
      </Button>
        <Select
          placeholder="Select masked database to access"
          style={{ width: 350 }} // 增加宽度以完全显示文字
          value={selectedWebsite}
          onChange={handleWebsiteChange}
          allowClear
        >
          <Option value="website1">Phone Number desensitization Database</Option>
          <Option value="website2">ID Card desensitization Database</Option>
          <Option value="website3">Address desensitization Database</Option>
        </Select>
      </div >
        {showFirstCard ? (
      <Card className="registration-card" style={{marginTop: 50}}>
        <Title level={2} className="registration-title">Hospital Registration System</Title>
        
        <Form ref={formRef} layout="vertical">
          <div className="form-section">
            <Title level={4}>Personal Information</Title>
            <div className="form-row">
              <Form.Item label="Full Name" validateStatus={errors.name ? 'error' : ''} help={errors.name}>
                <Input
                  placeholder="Please enter your full name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </Form.Item>
              
              <Form.Item label="ID Card Number" validateStatus={errors.idCard ? 'error' : ''} help={errors.idCard}>
                <Input
                  placeholder="Please enter your ID card number"
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  className="form-input"
                />
              </Form.Item>
            </div>
            
            <div className="form-row">
              <Form.Item label="Phone Number" validateStatus={errors.phone ? 'error' : ''} help={errors.phone}>
                <Input
                  placeholder="Please enter your phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </Form.Item>
              
              <Form.Item label="Address" validateStatus={errors.address ? 'error' : ''} help={errors.address}>
                <Input
                  placeholder="Please enter your address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                />
              </Form.Item>
            </div>
          </div>
          
          <div className="form-section">
            <Title level={4}>Registration Information</Title>
            <div className="form-row">
              <Form.Item label="Department" validateStatus={errors.department ? 'error' : ''} help={errors.department}>
                <Select
                  placeholder="Please select a department"
                  value={formData.department}
                  onChange={(value) => handleSelectChange('department', value)}
                  className="form-select"
                >
                  {departments.map(dept => (
                    <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item label="Doctor" validateStatus={errors.doctor ? 'error' : ''} help={errors.doctor}>
                <Select
                  placeholder="Please select a doctor"
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
                      {!doctor.available && ' (Full)'}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            
            <Form.Item label="Medical Description (Optional)" validateStatus={errors.description ? 'error' : ''} help={errors.description}>
  <Input.TextArea
    placeholder="Please briefly describe your condition (optional)"
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
  Submit Registration
</Button>
        </Form>
      </Card>
        ) : (
          <Card className="registration-card" style={{marginTop: 50, height: '600px', overflow: 'hidden'}}>
    <Title level={2} className="registration-title">{pageTitle}</Title>
    <div style={{height: 'calc(100% - 60px)', overflow: 'auto'}}>
      <Table
        dataSource={dataSource || []}
        columns={[
                  {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Phone',
                    dataIndex: 'phone',
                    key: 'phone',
                  },
                  {
                    title: 'ID Number',
                    dataIndex: 'id',
                    key: 'id',
                  },
                  {
                    title: 'Address',
                    dataIndex: 'address',
                    key: 'address',
                  },
                  {
                    title: 'Department',
                    dataIndex: 'department',
                    key: 'department',
                  },
                  {
                    title: 'Doctor',
                    dataIndex: 'doctor',
                    key: 'doctor',
                  },
                  {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                  },
                ]}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                  },
                  onShowSizeChange: (current, size) => {
                    setCurrentPage(1);
                    setPageSize(size);
                  },
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} entries`
        }}
        rowKey="id"
        scroll={{ y: 'calc(100vh - 400px)' }}
        // 添加空状态处理
        locale={{
          emptyText: '暂无数据'
        }}
      />
    </div>
          </Card>
     
        )}
      {/* 挂号成功弹窗 */}
      <Modal
        title="Registration Successful"
        open={isSuccessModalVisible}
        onOk={handleSuccessModalClose}
        onCancel={handleSuccessModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleSuccessModalClose}>
            OK
          </Button>
        ]}
      >
        <div className="success-content">
          <p>Congratulations! Your registration has been successful!</p>
          {successInfo.registrationId && (
            <p>Registration ID: {successInfo.registrationId}</p>
          )}
          {successInfo.appointmentTime && (
            <p>Appointment Time: {successInfo.appointmentTime}</p>
          )}
          <p>Please arrive at the hospital on time for your appointment.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Registration;