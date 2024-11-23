import { useRef, useEffect, useState } from "react";
import { Input, Spin } from "antd";
import "./DocumentChat.css";
import { generateDocumentChatResponse } from "@utils/generateDocumentChatResponse";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import apiService from "@utils/api/api-service";
import { Video } from "@models/video.model";
import { setUsageCount } from "@redux/features/userSlice";

const { Search } = Input;

interface ChatMessage {
  id: number;
  message: string;
  name: string;
}

const DocumentChat = ({ videoId }: { videoId: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const activeDocument = useSelector(
    (state: RootState) => state.document.activeDocument
  );
  const [chatBoxHeight, setChatBoxHeight] = useState(0);
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      message: "Hello, how can I help you today?",
      name: "Paul 🤖",
    },
  ]);
  const { token, usageCount } = useSelector(
    (state: RootState) => state.persisted.user.value
  );
  const [documentTranscript, setDocumentTranscript] = useState<string>("");

  const activeUserEmail = useSelector(
    (state: RootState) => state.persisted.user.value.activeUserEmail
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setChatBoxHeight(window.innerHeight - rect.top - 50);
    }
    const video = apiService.getVideo(videoId, token)
    video
      .then((res: Video) => {
        console.log(res.transcriptText);
        setDocumentTranscript(res.transcriptText ?? activeDocument.documentTranscript ?? "");
      })
      .catch((err) => {
        setDocumentTranscript(activeDocument.documentTranscript ?? "");
      })
  }, []);

  const sendMessage = async (query: string) => {
    setQuery("");
    setIsGenerating(true)
    setChatMessages([
      ...chatMessages,
      {
        id: 2,
        message: query,
        name: "You",
      }
    ]);
    dispatch(setUsageCount(usageCount! + 1))
    const response: string = await generateDocumentChatResponse(
      query,
      documentTranscript,
      chatMessages
    );
    setChatMessages([
      ...chatMessages,
      {
        id: 2,
        message: query,
        name: "You",
      },
      {
        id: 1,
        message: response,
        name: "Paul 🤖",
      }
    ]);
    setIsGenerating(false)
  };

  return (
    <div ref={divRef} style={{ height: chatBoxHeight }} className="chat-box">
      <div className="chat-messages">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={msg.id === 1 ? "recontact-message-item" : "user-message-item"}
          >
            <div>
              <b>{msg.name}</b>
            </div>
            <div>{msg.message}</div>
          </div>
        ))}
      </div>
      {isGenerating && (
        <div>
          <Spin />
          <br />
          <br />
          The bot is thinking....
        </div>
      )}
      <div className="chat-input-div">
        <Search
          placeholder="Type your message here...."
          allowClear
          enterButton="Send"
          size="large"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={(e) => sendMessage(e)}
          disabled={isGenerating}
        />
      </div>
    </div>
  );
};

export default DocumentChat;
