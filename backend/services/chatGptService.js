const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeContractRisk = async (contractText, retries = 3, delay = 5000) => {
  const prompt = `
  下記の契約書の内容についてリスクを洗い出して指定したフォーマットで返してください。
  ## フォーマット
  json形式とし、articleには条番号、contentにはどのようなリスクなのかを説明して疑問系で丁寧に投げかける形式としてください。
  [{"article" : "第xx条", "content": "〇〇していませんか？"},{"article" : "第xx条", "content": "〇〇していませんか？"}]
  のような形式としてください。

  ${contractText}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    // JSON文字列のみを抽出
    const content = response.choices[0].message.content.trim();
    const jsonStartIndex = content.indexOf('['); // JSONの開始位置を見つける
    const jsonEndIndex = content.lastIndexOf(']') + 1; // JSONの終了位置を見つける
    const jsonString = content.substring(jsonStartIndex, jsonEndIndex);

    // JSON形式で解析
    const riskAnalysis = JSON.parse(jsonString);

    return riskAnalysis;
  } catch (error) {
    console.error('Error in ChatGPT API:', error);

    if (error.status === 429 && retries > 0) {
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return analyzeContractRisk(contractText, retries - 1, delay);
    }

    throw new Error('ChatGPT APIでのリスク分析に失敗しました');
  }
};

module.exports = { analyzeContractRisk };
