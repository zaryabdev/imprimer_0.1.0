const AdmZip = require('adm-zip');

// createZipArchive("./test")

async function createZipArchive(filepath) {
  console.log(`Inside createZipArchive : ` + filepath);

  try {
    const zip = new AdmZip();
    const outputFile = 'test.zip';
    zip.addLocalFolder(filepath);
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}
