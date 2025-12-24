// // run gemini
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDlySdDThLHpKrbFKleCU4fEECforUBYs0" });






 export async function gemini(contents) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
  });
  console.log(response.text);
//   console.log(response);
  return response.text;
}
 



