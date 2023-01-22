import { Button, Col, Form, Input, Row, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const Backup: React.FC = () => {
  const [res, setRes] = useState({});
  function addToZip() {
    const status = {
      status: 'STARTED',
    };

    window.electron.ipcRenderer.addToZip(status);

    window.electron.ipcRenderer.on('add:zip', (responseData: any) => {
      console.log('add:zip event response');
      console.log({ responseData });
      setRes(responseData);
    });
  }

  return (
    <div>
      <Space size="middle">
        <Button type="primary" onClick={() => addToZip()}>
          Add to zip
        </Button>
        <Button type="primary" onClick={() => console.log('Hi')}>
          Upload Zip
        </Button>
      </Space>
      {JSON.stringify(res)}
    </div>
  );
};

export { Backup };
