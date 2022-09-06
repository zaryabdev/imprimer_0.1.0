import React, { useState, useEffect } from 'react';
import { Col, Row, Space, Table, Tag, Button, Form, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ProductName: React.FC = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [selectedItem, setSelectedItem] = useState({
    id: '',
    name: '',
  });

  // antd form - start

  const [form] = Form.useForm();

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        return;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        return;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  // antd form - end

  useEffect(() => {
    // getAllProductNames();
  }, []);

  const handleSelectedItem = (item) => {
    console.log(item);
    setSelectedItem(item);
  };
  const handleInput = (event: Event) => {
    const name: String = event.target.name;
    const value: String = event.target.value;
    setSelectedItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNew = () => {
    setSelectedItem({
      id: '',
      name: '',
    });
  };

  const createProductName = (item) => {
    console.log('Going to call createProductName');
    console.log({ item });
    window.electron.ipcRenderer.createProductName(item);

    window.electron.ipcRenderer.on('create:product_name', (responseData) => {
      console.log('create:product_name event response');
      console.log({ responseData });
      console.log('Going to call getAllProductNames from createProductName');
      // getAllProductNames();
    });
  };

  const updateProductName = (item) => {
    console.log('Going to call updateProductName');
    console.log({ item });
    window.electron.ipcRenderer.updateProductName(item);

    window.electron.ipcRenderer.on('update:product_name', (responseData) => {
      console.log('update:product_name event response');
      console.log({ responseData });
      console.log('Going to call getAllProductNames from updateProductName');
      getAllProductNames();
    });
  };
  const deleteProductName = (id) => {
    console.log('Going to call deleteProductName');
    window.electron.ipcRenderer.deleteProductName(id);

    window.electron.ipcRenderer.on('delete:product_name', (responseData) => {
      console.log('delete:product_name event response');
      console.log({ responseData });
      console.log('Going to call getAllProductNames from deleteProductName');
      addNew();
      getAllProductNames();
    });
  };

  const getAllProductNames = () => {
    console.log('Going to call getAllProductNames');
    window.electron.ipcRenderer.getAllProductNames();

    window.electron.ipcRenderer.on('get:product_names', (responseData) => {
      console.log('get:product_names event response');
      console.log({ responseData });
      setAllRecords(responseData);
    });
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <Table columns={columns} dataSource={data} />
        </Col>
        <Col span={12}>
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            <Form.Item name="note" label="Note" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onGenderChange}
                allowClear
              >
                <Option value="male">male</Option>
                <Option value="female">female</Option>
                <Option value="other">other</Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.gender !== currentValues.gender
              }
            >
              {({ getFieldValue }) =>
                getFieldValue('gender') === 'other' ? (
                  <Form.Item
                    name="customizeGender"
                    label="Customize Gender"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
              <Button type="link" htmlType="button" onClick={onFill}>
                Fill form
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>

    // <div className="container p-4">
    //   <div className="row">
    //     <div className="twelve columns">
    //       <h1>Product Name</h1>
    //     </div>
    //   </div>
    //   <div className="row">
    //     <div className="eight columns">
    //       <table className="u-full-width">
    //         <thead>
    //           <tr>
    //             <th>ID</th>
    //             <th>Name</th>
    //             <th>Edit</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {allRecords.map((record) => {
    //             return (
    //               <tr key={record.id}>
    //                 <td>{record.id}</td>
    //                 <td>{record.name}</td>
    //                 <td>
    //                   <button
    //                     className={`${
    //                       selectedItem.id === record.id ? 'button-primary' : ' '
    //                     }`}
    //                     onClick={() => handleSelectedItem(record)}
    //                   >
    //                     Edit
    //                   </button>
    //                 </td>
    //               </tr>
    //             );
    //           })}
    //         </tbody>
    //       </table>
    //     </div>
    //     <div className="four columns">
    //       <div className="row">
    //         <div className="twelve columns">
    //           <label htmlFor="date_created">ID</label>
    //           <input
    //             readOnly
    //             value={selectedItem.id}
    //             type="text"
    //             className="u-full-width is-disabled in-active"
    //             name="id"
    //           />
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="twelve columns">
    //           <label htmlFor="name">Name</label>
    //           <input
    //             type="text"
    //             className="u-full-width"
    //             name="name"
    //             value={selectedItem.name}
    //             onChange={(event) => {
    //               return handleInput(event);
    //             }}
    //           />
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="twelve columns">
    //           <label htmlFor="date_created">Date Created</label>
    //           <input
    //             readOnly
    //             value={selectedItem.date_created}
    //             type="text"
    //             className="u-full-width is-disabled in-active"
    //             name="date_created"
    //           />
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="four columns">
    //           <button
    //             className="button-primary"
    //             onClick={() => addNew()}
    //             disabled={selectedItem.name === ''}
    //           >
    //             Create
    //           </button>
    //         </div>
    //       </div>
    //       {selectedItem.id !== '' && (
    //         <div className="row">
    //           <div className="four columns">
    //             <button
    //               className={`button-primary ${
    //                 selectedItem.name === '' ? 'is-disabled' : ''
    //               }`}
    //               onClick={() => updateProductName(selectedItem)}
    //               disabled={selectedItem.name === '' ? true : false}
    //             >
    //               Update
    //             </button>
    //           </div>
    //         </div>
    //       )}
    //       {selectedItem.id === '' && (
    //         <div className="row">
    //           <div className="four columns">
    //             <button
    //               className={`button-primary ${
    //                 selectedItem.name === '' ? 'is-disabled' : ''
    //               }`}
    //               onClick={() => createProductName(selectedItem)}
    //               disabled={selectedItem.name === '' ? true : false}
    //             >
    //               Save
    //             </button>
    //           </div>
    //         </div>
    //       )}

    //       <div className="row">
    //         <div className="four columns">
    //           <button
    //             className={`button-primary ${
    //               selectedItem.id === '' ? 'is-disabled' : ''
    //             }`}
    //             disabled={selectedItem.id === '' ? true : false}
    //             onClick={() => deleteProductName(selectedItem.id)}
    //           >
    //             Delete
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export { ProductName };
