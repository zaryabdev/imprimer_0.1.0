const apikey = 'AZQAoIP90SHOOdiOPwUoAz';
const client = require('filestack-js').init(apikey);

// const myFile = './test.zip';

export function uploadArchive(location) {
  client.upload(location).then(
    function (result) {
      console.log(result);
    },
    function (error) {
      console.log(error);
    }
  );
}
