import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider } from 'antd';
import { createStyles } from 'antd-style';
import { SearchOutlined } from '@ant-design/icons';
import { searchPaymentByIDCard, submitMedicalInsurancePayment } from './service.ts';
import './index.css';

const { Title, Text } = Typography;

const Payment = () => {
  // 表单状态管理
  const [idCard, setIdCard] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  
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
  
  // 处理身份证号输入变化
  const handleIdCardChange = (e) => {
    setIdCard(e.target.value);
  };
  
  // 验证身份证号
  const validateIdCard = (value) => {
    const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!value) {
      return Promise.reject('请输入身份证号');
    }
    if (!idCardRegex.test(value)) {
      return Promise.reject('请输入有效的身份证号');
    }
    return Promise.resolve();
  };
  
  // 搜索缴费信息
  const handleSearch = async () => {
    try {
      await validateIdCard(idCard);
      
      setSearching(true);
      const result = await searchPaymentByIDCard({ idCard });
      
      if (result.success) {
        setPaymentInfo(result.data);
        message.success(result.message);
      } else {
        setPaymentInfo(null);
        message.error(result.message);
      }
    } catch (error) {
      setPaymentInfo(null);
      message.error(error.message || '搜索失败，请稍后重试');
    } finally {
      setSearching(false);
    }
  };
  
  // 处理医保支付
  const handleMedicalInsurancePayment = async () => {
    if (!paymentInfo) {
      message.warning('请先搜索缴费信息');
      return;
    }
    
    try {
      setLoading(true);
      const result = await submitMedicalInsurancePayment({
        paymentId: paymentInfo.registration.registrationId
      });
      
      if (result.success) {
        message.success(result.message);
        // 在实际项目中，这里应该跳转到医保支付页面
        // 由于接口未实现，这里只是模拟跳转
        setTimeout(() => {
          message.info('即将跳转到医保支付页面...');
        }, 1000);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('支付请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="payment-container">
      <Card className="payment-card">
        <Title level={2} className="payment-title">医院缴费系统</Title>
        
        <div className="search-section">
          <Form layout="vertical">
            <div className="form-row">
              <Form.Item
                label="身份证号"
                rules={[{ validator: validateIdCard }]}
              >
                <Input
                  placeholder="请输入患者身份证号"
                  value={idCard}
                  onChange={handleIdCardChange}
                  maxLength={18}
                  onPressEnter={handleSearch}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={searching}
                  style={{ marginTop: 24, width: '100%' }}
                >
                  搜索
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        
        <Divider />
        
        {paymentInfo ? (
          <div className="payment-details">
            {/* 患者信息 */}
            <div className="info-section">
              <Title level={4} className="info-title">患者信息</Title>
              <div className="info-item">
                <span className="info-label">姓名：</span>
                <span className="info-value">{paymentInfo.patient.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">身份证号：</span>
                <span className="info-value">{paymentInfo.patient.idCard}</span>
              </div>
              <div className="info-item">
                <span className="info-label">地址：</span>
                <span className="info-value">{paymentInfo.patient.address}</span>
              </div>
              <div className="info-item">
                <span className="info-label">联系电话：</span>
                <span className="info-value">{paymentInfo.patient.phone}</span>
              </div>
            </div>
            
            {/* 挂号信息 */}
            <div className="info-section">
              <Title level={4} className="info-title">挂号信息</Title>
              <div className="info-item">
                <span className="info-label">挂号单号：</span>
                <span className="info-value">{paymentInfo.registration.registrationId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">科室：</span>
                <span className="info-value">{paymentInfo.registration.departmentName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">医生：</span>
                <span className="info-value">{paymentInfo.registration.doctorName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">预约时间：</span>
                <span className="info-value">{paymentInfo.registration.appointmentTime}</span>
              </div>
              {paymentInfo.registration.description && (
                <div className="info-item">
                  <span className="info-label">病情描述：</span>
                  <span className="info-value">{paymentInfo.registration.description}</span>
                </div>
              )}
            </div>
            
            {/* 缴费金额 */}
            <div className="payment-amount">
              待缴费金额：¥{paymentInfo.amount.toFixed(2)}
            </div>
            
            {/* 支付按钮 */}
            <Button
              type="primary"
              className={`${styles.linearGradientButton} payment-button`}
              onClick={handleMedicalInsurancePayment}
              loading={loading}
              size="large"
              block
            >
              医保支付
            </Button>
          </div>
        ) : (
          <div className="empty-state">
            <Text>请输入身份证号并点击搜索按钮查询缴费信息<br/>示例身份证号：110101199001011234</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Payment;