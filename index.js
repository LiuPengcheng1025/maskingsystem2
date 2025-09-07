import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css'; // 引入 Ant Design 样式
import App from './App';
import HeaderNav from './src/components/HeaderNav';
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <HashRouter>
  <HeaderNav></HeaderNav>
</HashRouter>
);
