import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  FormOutlined,
  SettingOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import Setup from './imprimer/Setup';
import Grid from './imprimer/GridSample';
import PackingType from './imprimer/PackingType';
import ProductName from './imprimer/ProductName';
import 'antd/dist/antd.css';
import './styles/skeleton.css';
import './App.css';

// import MainLayout from './imprimer/MainLayout';
const { Content, Footer, Sider } = Layout;

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className="no-drag"
        >
          <div className="logo" />
          {/* <Menu
            theme="light"
            defaultSelectedKeys={['0']}
            mode="inline"
            items={items}
          /> */}
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="grid">
              <FormOutlined />
              <span>Grid</span>
              <Link to="/" />
            </Menu.Item>
            <Menu.SubMenu
              title={
                <React.Fragment>
                  <SettingOutlined />
                  <span>Setup</span>
                </React.Fragment>
              }
            >
              <Menu.Item key="packing_type">
                <OrderedListOutlined />
                <span>Packing Type</span>
                <Link to="/packing_type" />
              </Menu.Item>
              <Menu.Item key="product_name">
                <OrderedListOutlined />
                <span>Product Name</span>
                <Link to="/product_name" />
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout no-drag">
          <Content style={{ margin: '0 16px' }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Routes>
                <Route exact path="/" element={<Grid />} />
                <Route path="/packing_type" element={<PackingType />} />
                <Route path="/product_name" element={<ProductName />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Imprimer ©2022 Created by Z labs
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
}
