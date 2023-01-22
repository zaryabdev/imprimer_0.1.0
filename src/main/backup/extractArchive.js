const AdmZip = require('adm-zip');
const path = require('path');

async function extractArchive(filepath) {
  try {
    const zip = new AdmZip(filepath);
    const outputDir = `${path.parse(filepath).name}_extracted`;
    zip.extractAllTo(outputDir);

    console.log(`Extracted to "${outputDir}" successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

// extractArchive("./test.zip");
