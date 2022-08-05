import React, { useState, useEffect } from 'react';

export default ProductName = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [selectedItem, setSelectedItem] = useState({
    id: '',
    name: '',
  });

  useEffect(() => {
    getAllProductNames();
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
      getAllProductNames();
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
    <div className="container p-4">
      <div className="row">
        <div className="twelve columns">
          <h1>Product Name</h1>
        </div>
      </div>
      <div className="row">
        <div className="eight columns">
          <table className="u-full-width">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {allRecords.map((record) => {
                return (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.name}</td>
                    <td>
                      <button
                        className={`${
                          selectedItem.id === record.id ? 'button-primary' : ' '
                        }`}
                        onClick={() => handleSelectedItem(record)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="four columns">
          <div className="row">
            <div className="twelve columns">
              <label htmlFor="date_created">ID</label>
              <input
                readOnly
                value={selectedItem.id}
                type="text"
                className="u-full-width is-disabled in-active"
                name="id"
              />
            </div>
          </div>
          <div className="row">
            <div className="twelve columns">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="u-full-width"
                name="name"
                value={selectedItem.name}
                onChange={(event) => {
                  return handleInput(event);
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="twelve columns">
              <label htmlFor="date_created">Date Created</label>
              <input
                readOnly
                value={selectedItem.date_created}
                type="text"
                className="u-full-width is-disabled in-active"
                name="date_created"
              />
            </div>
          </div>
          <div className="row">
            <div className="four columns">
              <button
                className="button-primary"
                onClick={() => addNew()}
                disabled={selectedItem.name === ''}
              >
                Create
              </button>
            </div>
          </div>
          {selectedItem.id !== '' && (
            <div className="row">
              <div className="four columns">
                <button
                  className={`button-primary ${
                    selectedItem.name === '' ? 'is-disabled' : ''
                  }`}
                  onClick={() => updateProductName(selectedItem)}
                  disabled={selectedItem.name === '' ? true : false}
                >
                  Update
                </button>
              </div>
            </div>
          )}
          {selectedItem.id === '' && (
            <div className="row">
              <div className="four columns">
                <button
                  className={`button-primary ${
                    selectedItem.name === '' ? 'is-disabled' : ''
                  }`}
                  onClick={() => createProductName(selectedItem)}
                  disabled={selectedItem.name === '' ? true : false}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <div className="row">
            <div className="four columns">
              <button
                className={`button-primary ${
                  selectedItem.id === '' ? 'is-disabled' : ''
                }`}
                disabled={selectedItem.id === '' ? true : false}
                onClick={() => deleteProductName(selectedItem.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
