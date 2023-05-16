const axios = require('axios');
require("dotenv").config();
// const apiUrl = 'https://api.etherscan.io/api';
const apiUrl = 'https://api-goerli.etherscan.io/api';


const apiKey = process.env.apiKey;

async function fetchContractSourceCode(address) {
  try {
    // goerliのapiを呼び出す
    const response = await axios.get(apiUrl, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: apiKey,
      }});

    // 返ってきたデータを変数に格納
    const { status, message, result } = response.data;

    if (status === '1' && message === 'OK') {
      const contract = result[0];
      let sourceCode = contract.SourceCode;
      // const name = 'contracts/BuyMeACofee.sol';
      // console.log(sourceCode);

      
      sourceCode =  sourceCode.replace("{{", "{");
      sourceCode=  sourceCode.replace("}}", "}");

      // json形式に変換するとともに、コントラクト名を取得し、ソースコードのみ返す
      sourceCode = JSON.parse(sourceCode);
      // console.log(sourceCode.sources);
      
      const regex = /contracts\/(.*\.sol)/;
      const fileName = Object.keys(sourceCode.sources).find(key => regex.test(key));
      const codeName = fileName.match(regex)[1];

      // console.log(codeName);
      sourceCode = sourceCode.sources;
      sourceCode = sourceCode[`contracts/${codeName}`];
      sourceCode = sourceCode['content'];
      // console.log(sourceCode);
      return sourceCode

    } else {
      console.error('Failed to fetch contract source code:', message);
    }
  } catch (error) {
    console.error('Error occurred while fetching contract source code:', error.message);
  }
}

// fetchContractSourceCode();

// 外部ファイルから呼び出せるようにする
module.exports = { 
  fetchContractSourceCode 
};