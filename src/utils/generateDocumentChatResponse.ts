import axios from "axios";


export const generateDocumentChatResponse = async (query:string,transcript: string, chatHistory:any[]) => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  const parsedChatHistory = chatHistory.map(item => `${item.id==1?'you':'user'} : ${item.message}`).join('\n')

  const headers = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  };

  let content = `You are an expert in analyzing call transcript between people.
    
  This is the query that the user is asking: ${query}.

  Your job is to analyze the transcript below and provide a response to the query above.

  The word limit is 100 words at maximum, and the response should be concise and to the point.

  The response should be returned in the following JSON format

  {chatResponse:string}

  This is the chat history between you and the user which you can use for context: ${parsedChatHistory}
  
  Here's the transcript: ${transcript}
  `;
    
    const MAX_CHARS = 128000 * 4; // Roughly 4 characters per token
    const supportingPromptContextLength = content.length
    const maxQueryLength = MAX_CHARS - supportingPromptContextLength;

    if (new TextEncoder().encode(query).length > maxQueryLength) {
      content = content.substring(0, maxQueryLength);
    }

  const body = {
    model: "gpt-4o",
    messages: [{ role: "user", content: content }],
    response_format: {
      type: "json_object",
    },
  };

  try {
      const response = await axios.post(url, body, { headers });
      // console.log(response)
      const responseContent = JSON.parse(
        response.data.choices[0].message.content
      );
      return responseContent.chatResponse
  } catch (error) {
      // console.log(error);
        return "I'm sorry, I don't have an answer to that question";
  }
};