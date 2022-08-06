const { contextBridge, ipcRenderer } = require('electron');

const WINDOW_API = {
  ipcRenderer: {
    createBill(preloadData) {
      console.log("Inside preload create:bill")
      console.log({preloadData})
      ipcRenderer.send('create:bill', preloadData);
    },
    updateBill(preloadData) {
      console.log("Inside preload update:bill")
      console.log({preloadData})

      ipcRenderer.send('update:bill', preloadData);
    },

    deleteBill(preloadData) {
      console.log("Inside preload delete:bill")
      console.log({preloadData})

      ipcRenderer.send('delete:bill', preloadData);
    },
    getAllBills(preloadData) {
      console.log("Inside preload get:bills")
      console.log({preloadData})

      ipcRenderer.send('get:bills', preloadData);
    },
    createPackingType(preloadData) {
      console.log("Inside preload create:packing_type")
      console.log({preloadData})
      ipcRenderer.send('create:packing_type', preloadData);
    },
    updatePackingType(preloadData) {
      console.log("Inside preload update:packing_type")
      console.log({preloadData})

      ipcRenderer.send('update:packing_type', preloadData);
    },
    deletePackingType(preloadData) {
      console.log("Inside preload delete:packing_type")
      console.log({preloadData})

      ipcRenderer.send('delete:packing_type', preloadData);
    },
    getAllPackingTypes(preloadData) {
      console.log("Inside preload get:packing_types")
      console.log({preloadData})

      ipcRenderer.send('get:packing_types', preloadData);
    },
    createProductName(preloadData) {
      console.log("Inside preload create:product_name")
      console.log({preloadData})
      ipcRenderer.send('create:product_name', preloadData);
    },
    updateProductName(preloadData) {
      console.log("Inside preload update:product_name")
      console.log({preloadData})

      ipcRenderer.send('update:product_name', preloadData);
    },
    deleteProductName(preloadData) {
      console.log("Inside preload delete:product_name")
      console.log({preloadData})

      ipcRenderer.send('delete:product_name', preloadData);
    },
    getAllProductNames(preloadData) {
      console.log("Inside preload get:product_names")
      console.log({preloadData})

      ipcRenderer.send('get:product_names', preloadData);
    },
    on(channel, func) {
      const validChannels = [
        'get:bills',
        'delete:bill',
        'update:bill',
        'create:bill',
        'create:packing_type',
        'update:packing_type',
        'delete:packing_type',
        'get:packing_types',
        'create:product_name',
        'update:product_name',
        'delete:product_name',
        'get:product_names'
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  },
}

contextBridge.exposeInMainWorld('electron',WINDOW_API );
