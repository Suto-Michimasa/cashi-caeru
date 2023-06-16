import axios from "axios";
import { config } from "../plugins/firebase";


export const generateMessage = async (creditorName: string, eventName: string, daysRemaining: number): Promise<GenerateMessageResponse> => {
// ChatGPT APIを使ってメッセージを生成します
  const prompt = `${creditorName}さんから${eventName}に関する返済のリマインドがあります。返済期日まであと${daysRemaining}日ですケロ。`;
  const body = JSON.stringify({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });
  const gptResponse = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    body,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.openai.key}`,
      },
    }
  );
  return gptResponse.data.choices[0].message;
};
