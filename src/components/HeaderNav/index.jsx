import { useState } from 'react';
import { useNavigate, Route, Routes , Navigate } from 'react-router-dom';
import {
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from '@ant-design/icons';
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';
import defaultProps from './_defaultProps.js';
import logoImg from '../background/g.png';
import { useLocation } from 'react-router-dom';
import Registration from '../../pages/Registration/index.jsx';
import Payment from '../../pages/Payment/index.jsx';

/**
 * HeaderNav 组件 - 应用的头部导航组件
 * 包含侧边栏菜单、用户信息和路由管理
 */
const HeaderNav = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh', // 占满整个视口高度
      }}
    >
      <ProLayout
        siderWidth={170}
        logo={
          <div>
            <img src={logoImg} alt="logo" style={{ width: '60px', height: 'auto' }} />
          </div>
        }
         title={<span style={{ color: 'white', fontSize: '20px' ,marginTop:-10}}></span>}
         bgLayoutImgList={[
          {
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #0d4d4a 0%, #1a9188 50%, #51b7a9 100%)',
            backgroundColor: '#0d4d4a', // 回退颜色
          },
        ]}
        {...defaultProps}
        avatarProps={{
          title: <span style={{ color: 'white' }}>admin</span>,
          size: 'small',
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return [
            <InfoCircleFilled key="InfoCircleFilled" />,
            <QuestionCircleFilled key="QuestionCircleFilled" />,
            <GithubFilled key="GithubFilled" />,
          ];
        }}
        menuItemRender={(item, dom) => (
          <div
            style={{
              color: currentPath === item.path ? '#40a9ff' : '#a0a0a0',
              backgroundColor: currentPath === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              fontWeight: currentPath === item.path ? 'bold' : 'normal',
              padding: '8px 20px',
              borderRadius: '4px',
              borderLeft: currentPath === item.path ? '4px solid #40a9ff' : 'none',
              textShadow: currentPath === item.path ? '0 0 2px rgba(64, 169, 255, 0.5)' : 'none',
              transition: 'all 0.1s ease',
              whiteSpace: 'nowrap',
              width: '200px',
            }}
            onClick={() => {
              navigate(item.path || '/1');
            }}
          >
            {dom}
          </div>
        )}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <PageContainer>
          <ProCard
            style={{
              height: '100vh', // 占满整个视口高度
              minHeight: 800, // 设置最小高度
            }}
          >
            <Routes>
  <Route path="/" element={<Navigate to="/3" replace />} />
  <Route path="/3" element={<Registration />} />
  <Route path="/4" element={<Payment />} />
</Routes>
          </ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  );
};

export default HeaderNav;