const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadFile(url, folder, name) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    response.data.pipe(fs.createWriteStream(`/tmp/${folder}/${name}`));
    await sleep(500)
    const json = JSON.parse(fs.readFileSync(`/tmp/${folder}/${name}`));
    fs.unlinkSync(`/tmp/${folder}/${name}`)
    return json;
  } catch (err) {
    fs.unlinkSync(`/tmp/${folder}/${name}`)
    throw { error: 'Invalid file format and content' }
  }

}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = { downloadFile, sleep }