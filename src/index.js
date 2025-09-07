/*
 * @Author: yyxn lilinadlilith@gmail.com
 * @Date: 2025-02-28 17:08:12
 * @LastEditors: yyxn lilinadlilith@gmail.com
 * @LastEditTime: 2025-02-28 19:13:59
 * @FilePath: \police-project\src\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { HashRouter as Router } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import HeaderNav from "./components/HeaderNav/index";

// 获取根节点
const root = ReactDOM.createRoot(document.getElementById('root'));

// 渲染应用
root.render(
  <Router basename="/maskingSystem2">  
    <HeaderNav />
  </Router>
);