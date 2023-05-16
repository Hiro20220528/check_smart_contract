const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const security_ai_role = "You are a Solidity programmer and security engineer. Analyze the following code and answer whether you are allowed to access its smart contract, i.e., whether it is secure or insecure.";
const result_ai_role = "Answer whether the following English sentence is safe or unsafe to say. Answer either {safe} or {unsafe}. If you are not sure, answer {I don't know}. Do not answer otherwise."

async function security_api(contractCode) {
          try {
                    const completion = await openai.createChatCompletion({
                              model: "gpt-3.5-turbo",
                              messages: [
                                        {"role": "system", "content": security_ai_role},
                                        { role: "user", content: contractCode}],
                    });
                    // console.log(completion.data.choices[0].message);
          
                    return completion.data.choices[0].message;

          }catch (error) {
                    console.error('Error occurred while fetching contract source code:', error.message);
          }
          
}

async function result_api(result_message) {
          const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                              {"role": "system", "content": result_ai_role},
                              { role: "user", content: result_message}],
          });
          return completion.data.choices[0].message;
}



module.exports = {
          security_api,
          result_api
};