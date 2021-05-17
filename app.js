const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function getsheet() {
  const doc = new GoogleSpreadsheet(process.env.sheetKey);

  await doc.useServiceAccountAuth({
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key.replace(/\\n/gm, '\n'),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
  });

  await doc.loadInfo();
  
  const sheet = doc.sheetsByIndex[0];

  // select column
  await sheet.loadCells('A1:Z1000');
  const rows = await sheet.getRows();

  const arr = [];
  rows.forEach(row => {
    arr.push({
      name: row['請填寫您的暱稱'],
      week1: row['你的第一週主線做的 LV 是？(選填，5/12 才填寫)'],
      week1Url: row['請提交您的第一週的作業或 BLOG 網址(選填，5/12 才填寫)'],
      everyday: row['您的每日任務目前做到幾月幾號？'],
    })
  })
  

  fs.writeFileSync(path.join(__dirname, 'result', 'data.json'), JSON.stringify(arr));
}

getsheet();