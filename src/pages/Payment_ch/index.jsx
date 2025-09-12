import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider } from 'antd';
import { createStyles } from 'antd-style';
import { SearchOutlined } from '@ant-design/icons';
import { searchPaymentByIDCard, submitMedicalInsurancePayment  , getPayment} from './service.ts';
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
    if (!value) {
      return Promise.reject('请输入身份证号码');
    }
    if (value.length !== 18) {
      return Promise.reject('身份证格式有误，请重新输入');
    }
    return Promise.resolve();
  };
  
  // 搜索缴费信息
  const handleSearch = async () => {
    try {
       await validateIdCard(idCard);
      
      setSearching(true);
      
      const params ={
        id:idCard
      }
      console.log("params",params);
      const result = await getPayment(params);
      console.log("result",result)
      console.log("result.data",result.data)
      setPaymentInfo(result.data);
    } catch (error) {
      console.log("idCard",idCard);
      setPaymentInfo(null);
      message.error(error.message || '搜索失败，请稍后再试');
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
          message.info('正在跳转到医保支付页面...');
        }, 1000);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('支付请求失败，请稍后再试');
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
                label="身份证号码"
                rules={[
                  {
                    validator: validateIdCard,
                    validateTrigger: ['onBlur', 'onChange']
                  }
                ]}
              >
                <Input
                  placeholder="请输入患者身份证号码"
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
                <span className="info-label">姓名: </span>
                <span className="info-value">{paymentInfo.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">身份证: </span>
                <span className="info-value">{paymentInfo.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">地址: </span>
                <span className="info-value">{paymentInfo.address}</span>
              </div>
              <div className="info-item">
                <span className="info-label">电话: </span>
                <span className="info-value">{paymentInfo.phone}</span>
              </div>
            </div>
            
            {/* 挂号信息 */}
            <div className="info-section">
              <Title level={4} className="info-title">挂号信息</Title>
              <div className="info-item">
                <span className="info-label">挂号ID: </span>
                <span className="info-value">{paymentInfo.registration}</span>
              </div>
              <div className="info-item">
                <span className="info-label">科室: </span>
                <span className="info-value">{paymentInfo.department}</span>
              </div>
              <div className="info-item">
                <span className="info-label">医生: </span>
                <span className="info-value">{paymentInfo.doctor}</span>
              </div>
              <div className="info-item">
                <span className="info-label">预约时间: </span>
                <span className="info-value">略</span>
              </div>
              {paymentInfo.registration.description && (
                <div className="info-item">
                  <span className="info-label">描述: </span>
                  <span className="info-value">略</span>
                </div>
              )}
            </div>
            
            {/* 缴费金额 */}
            <div className="payment-amount">
              待支付金额: ¥537.85
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
            <Text>请输入身份证号码并点击搜索按钮查询缴费信息<br/>示例ID: 110101199001011234</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Payment;