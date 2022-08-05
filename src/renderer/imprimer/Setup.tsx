import React, { useState, useEffect } from 'react';

export default Setup2 = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [selectedItem, setSelectedItem] = useState({
    id: '',
    name: '',
    date_created: '',
  });

  useEffect(() => {
    getAllBills();
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
      date_created: '',
    });
  };

  const createBill = (item) => {
    console.log('Going to call createBill');
    console.log({ item });
    window.electron.ipcRenderer.createBill(item);

    window.electron.ipcRenderer.on('create:bill', (responseData) => {
      console.log('create:bill event response');
      console.log({ responseData });
      console.log('Going to call getAllBills from createBill');
      getAllBills();
    });
  };

  const updateBill = (item) => {
    console.log('Going to call updateBill');
    console.log({ item });
    window.electron.ipcRenderer.updateBill(item);

    window.electron.ipcRenderer.on('update:bill', (responseData) => {
      console.log('create:bill event response');
      console.log({ responseData });
      console.log('Going to call getAllBills from updateBill');
      getAllBills();
    });
  };
  const deleteBill = (id) => {
    console.log('Going to call deleteBill');
    window.electron.ipcRenderer.deleteBill(id);

    window.electron.ipcRenderer.on('delete:bill', (responseData) => {
      console.log('create:bill event response');
      console.log({ responseData });
      console.log('Going to call getAllBills from deleteBill');
      addNew();
      getAllBills();
    });
  };

  const getAllBills = () => {
    console.log('Going to call getAllBills');
    window.electron.ipcRenderer.getAllBills();

    window.electron.ipcRenderer.on('get:bills', (responseData) => {
      console.log('get:bills event response');
      console.log({ responseData });
      setAllRecords(responseData);
    });
  };

  return (
    <div className="container p-4">
      {/* <div className="row">
        <div className="twelve columns">
          <h1>CRUD</h1>
        </div>
      </div> */}
      <div className="row">
        <div className="eight columns">
          <table className="u-full-width">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date Created</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {allRecords.map((record) => {
                return (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.name}</td>
                    <td>{record.date_created}</td>
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
                  onClick={() => updateBill(selectedItem)}
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
                  onClick={() => createBill(selectedItem)}
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
                onClick={() => deleteBill(selectedItem.id)}
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
