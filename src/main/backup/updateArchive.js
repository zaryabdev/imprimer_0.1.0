const AdmZip = require('adm-zip');
const fs = require('fs').promises;

async function updateZipArchive(filepath) {
  try {
    const zip = new AdmZip(filepath);

    content = await fs.readFile('./test/file2.txt');
    zip.addFile('file4.txt', content);
    zip.writeZip(filepath);
    console.log(`Updated ${filepath} successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

// updateZipArchive('./test.zip');
