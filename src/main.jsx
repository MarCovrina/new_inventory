import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import ruRU from 'antd/locale/ru_RU';

import 'antd/dist/reset.css';
import InventoryRegistry from './components/InventoryRegistry';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={ruRU}>
      <AntApp>
        <InventoryRegistry />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
