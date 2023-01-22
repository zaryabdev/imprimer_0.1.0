const AdmZip = require('adm-zip');

async function readZipArchive(filepath) {
  try {
    const zip = new AdmZip(filepath);

    for (const zipEntry of zip.getEntries()) {
      console.log(zipEntry.name);
    }
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

// readZipArchive("./test.zip");
