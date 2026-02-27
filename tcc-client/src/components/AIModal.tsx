import { useState } from "react";
import axios from "axios";

type Message = { role: "user" | "assistant"; content: string };

export default function AIModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/dialogflow/chat", {
        message: input,
      });

      const botReply: Message = {
        role: "assistant",
        content: response.data.reply || "Sorry, I didn't understand that.",
      };

      setMessages((prev) => [...prev, botReply]);
      setInput("");
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal chat-modal" onClick={(e) => e.stopPropagation()}>
        <h3>AI Voter Assistant 🤖</h3>
        <div className="chat-container">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {loading && <div className="chat-bubble assistant">Typing...</div>}
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about voting, registration..."
          />
          <button onClick={sendMessage} disabled={loading}>Send</button>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
