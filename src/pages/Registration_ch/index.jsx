import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { Form, Input, Button, Card, message, Modal, Select, Typography, Table } from 'antd';
import { createStyles } from 'antd-style';
import { departments, doctorsByDepartment } from './data.ts';
import { submitRegistration } from './service.ts';
import './index.css';
import { getInfoEntryList, userInfoAdd } from './service.ts';


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
      newErrors.name = '请输入您的姓名';
    }
    
    // 身份证验证
    if (!formData.idCard.trim()) {
      newErrors.idCard = '请输入您的身份证号';
    } else if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.idCard)) {
      newErrors.idCard = '请输入有效的身份证号';
    }
    
    // 地址验证
    if (!formData.address.trim()) {
      newErrors.address = '请输入您的地址';
    }
    
    // 电话验证
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入您的手机号码';
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
      newErrors.description = '病情描述不能超过500个字符';
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
        message.success('挂号成功！');
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
        message.error(result.message || '挂号失败，请稍后再试');
      }
    } catch (error) {
      message.error('挂号失败，请稍后再试');
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
  const [cardText, setCardText] = useState('前往应用数据库');

  // 使用 useState 管理页面标题
  const [pageTitle, setPageTitle] = useState('员工信息录入系统');

  // 处理第二个卡片点击事件
  const handleSecondCardClick = () => {
    setShowFirstCard(!showFirstCard);
    
    // 切换图片和文字内容
    if (showFirstCard) {
      formRef.current.resetFields();
      setCardText('返回添加信息');
      // 切换标题为员工数据库
      setPageTitle('员工数据库');
      // 调用接口获取最新数据列表
      fetchTableData();
    } else {
      setCardText('前往应用数据库');
      // 切换回原标题
      setPageTitle('员工信息录入系统');
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
          placeholder="选择要访问的脱敏数据库"
          style={{ width: 350 }} // 增加宽度以完全显示文字
          value={selectedWebsite}
          onChange={handleWebsiteChange}
          allowClear
        >
          <Option value="website1">手机号脱敏数据库</Option>
          <Option value="website2">身份证脱敏数据库</Option>
          <Option value="website3">地址脱敏数据库</Option>
        </Select>
      </div >
        {showFirstCard ? (
      <Card className="registration-card" style={{marginTop: 50}}>
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
              <Form.Item label="手机号码" validateStatus={errors.phone ? 'error' : ''} help={errors.phone}>
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
                  placeholder="请输入您的地址"
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
            
            <Form.Item label="病情描述（可选）" validateStatus={errors.description ? 'error' : ''} help={errors.description}>
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
        ) : (
          <Card className="registration-card" style={{marginTop: 50, height: '600px', overflow: 'hidden'}}>
    <Title level={2} className="registration-title">{pageTitle}</Title>
    <div style={{height: 'calc(100% - 60px)', overflow: 'auto'}}>
      <Table
        dataSource={dataSource || []}
        columns={[
                  {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: '电话',
                    dataIndex: 'phone',
                    key: 'phone',
                  },
                  {
                    title: '身份证号',
                    dataIndex: 'id',
                    key: 'id',
                  },
                  {
                    title: '地址',
                    dataIndex: 'address',
                    key: 'address',
                  },
                  {
                    title: '科室',
                    dataIndex: 'department',
                    key: 'department',
                  },
                  {
                    title: '医生',
                    dataIndex: 'doctor',
                    key: 'doctor',
                  },
                  {
                    title: '描述',
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
          showTotal: (total) => `共: ${total} 条记录`
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
          <p>恭喜！您的挂号已成功！</p>
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