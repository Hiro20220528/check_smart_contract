const eth_api = require('./contract_api');
const gpt_api = require('./gpt_api');

require('dotenv').config()

const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const PORT = 8000;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
// app.set("views", "./views");
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true })); // postできる

app.get("/", (req, res) => {
  // console.log("Hello");
  // res.send("hello");
  const result = {
    sampleAddress : process.env.sampleAddress,
  }
  res.render("home", result);
});

// app.get("/about", (req, res) => {
//   // console.log("Hello");
//   // res.send("hello");
//   res.render("about");
// });


app.post("/", async (req, res) => {
  // console.log(req.body.code);
  let address = req.body.code;
  // console.log(`call api: ${await api.fetchContractSourceCode()}`);
  let code = await eth_api.fetchContractSourceCode(address);

  // 改行を<br>タグに直し、画面に表示する
  let HTMLtext = code.replace(/\r?\n/g, '<br>');

  // gptに分析させる
  let analysisCode = code.replace(/\r?\n/g, '');
  let analysisMessage = await gpt_api.security_api(analysisCode);

  let securityText = await gpt_api.result_api(analysisMessage['content']);
  // console.log(analysisMessage['content']);
  console.log(securityText['content']);

  // console.log(HTMLtext);


  let result = {
    sampleAddress : process.env.sampleAddress,
    text : req.body.code,
    smartcontract : HTMLtext,
    analysis : analysisMessage['content'],
    level : securityText['content'],
  };
  
  res.render("home", result);
});

app.listen(PORT, () => console.log("running sever"))