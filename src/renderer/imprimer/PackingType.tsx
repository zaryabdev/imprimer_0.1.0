import React, { useState, useEffect } from 'react';

export default PackingType = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [selectedItem, setSelectedItem] = useState({
    id: '',
    name: '',
  });

  useEffect(() => {
    getAllPackingTypes();
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

  const createPackingType = (item) => {
    console.log('Going to call createPackingType');
    console.log({ item });
    window.electron.ipcRenderer.createPackingType(item);

    window.electron.ipcRenderer.on('create:packing_type', (responseData) => {
      console.log('create:packing_type event response');
      console.log({ responseData });
      console.log('Going to call getAllPackingTypes from createPackingType');
      getAllPackingTypes();
    });
  };

  const updatePackingType = (item) => {
    console.log('Going to call updatePackingType');
    console.log({ item });
    window.electron.ipcRenderer.updatePackingType(item);

    window.electron.ipcRenderer.on('update:packing_type', (responseData) => {
      console.log('update:packing_type event response');
      console.log({ responseData });
      console.log('Going to call getAllPackingTypes from updatePackingType');
      getAllPackingTypes();
    });
  };
  const deletePackingType = (id) => {
    console.log('Going to call deletePackingType');
    window.electron.ipcRenderer.deletePackingType(id);

    window.electron.ipcRenderer.on('delete:packing_type', (responseData) => {
      console.log('delete:packing_type event response');
      console.log({ responseData });
      console.log('Going to call getAllPackingTypes from deletePackingType');
      addNew();
      getAllPackingTypes();
    });
  };

  const getAllPackingTypes = () => {
    console.log('Going to call getAllPackingTypes');
    window.electron.ipcRenderer.getAllPackingTypes();

    window.electron.ipcRenderer.on('get:packing_types', (responseData) => {
      console.log('get:packing_types event response');
      console.log({ responseData });
      setAllRecords(responseData);
    });
  };

  return (
    <div className="container p-4">
      <div className="row">
        <div className="twelve columns">
          <h1>Packing Type</h1>
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
                  onClick={() => updatePackingType(selectedItem)}
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
                  onClick={() => createPackingType(selectedItem)}
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
                onClick={() => deletePackingType(selectedItem.id)}
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
