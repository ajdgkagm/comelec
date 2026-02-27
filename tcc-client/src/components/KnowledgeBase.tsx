import { useState } from "react";
import axios from "axios";
import "./KnowledgeBase.css";

/* ===== Types ===== */
type KBKey = "register" | "who" | "process" | "faq";
type Message = { role: "user" | "assistant"; content: string };

/* ===== Knowledge Base Data ===== */
const kbContent: Record<KBKey, { title: string; description: string; items: string[] }> = {
  register: {
    title: "How to Register",
    description: "Steps to register as a voter under the Commission on Elections (COMELEC).",
    items: [
      "Must be at least 18 years old on or before Election Day.",
      "Bring a valid government-issued ID.",
      "Go to nearest COMELEC office.",
      "Fill out CEF-1 form.",
      "Submit biometrics.",
      "Wait for confirmation.",
    ],
  },
  who: {
    title: "Who Can Vote",
    description: "Eligibility requirements.",
    items: ["Filipino citizen.", "18+ years old.", "Resident for required duration.", "Registered voter."],
  },
  process: {
    title: "Election Process",
    description: "Step-by-step voting guide.",
    items: ["Go to your precinct.", "Present ID.", "Receive ballot.", "Shade candidates.", "Insert into VCM."],
  },
  faq: { title: "", description: "", items: [] },
};

/* ===== AI Chat Modal ===== */
function AIModal({ onClose }: { onClose: () => void }) {
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
  <div className="ai-backdrop" onClick={onClose}>
    <div className="ai-modal" onClick={(e) => e.stopPropagation()}>

      <div className="ai-header">
        <h3>🤖 AI Voter Assistant</h3>
        <button className="ai-close" onClick={onClose}>✕</button>
      </div>

      <div className="ai-chat">
        {messages.length === 0 && (
          <div className="ai-welcome">
            Ask me about voter registration, precinct info, or election updates.
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`ai-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="ai-message assistant typing">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      <div className="ai-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your question here..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>

    </div>
  </div>
);
}

/* ===== Normal Modal ===== */
function KBModal({ data, onClose }: { data: (typeof kbContent)[KBKey]; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{data.title}</h3>
        <p className="modal-desc">{data.description}</p>
        <ul>
          {data.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

/* ===== Main Component ===== */
export default function KnowledgeBase(): JSX.Element {
  const [activeKB, setActiveKB] = useState<KBKey | null>(null);

  return (
    <>
      <section className="knowledge">
        <h2>Knowledge Base</h2>
        <div className="kb-grid">
          <div className="card small clickable" onClick={() => setActiveKB("register")}>
            How to Register
          </div>
          <div className="card small clickable" onClick={() => setActiveKB("who")}>
            Who Can Vote
          </div>
          <div className="card small clickable" onClick={() => setActiveKB("process")}>
            Election Process
          </div>
          <div className="card small clickable" onClick={() => setActiveKB("faq")}>
            AI FAQs
          </div>
        </div>
      </section>

      {activeKB === "faq" && <AIModal onClose={() => setActiveKB(null)} />}
      {activeKB && activeKB !== "faq" && <KBModal data={kbContent[activeKB]} onClose={() => setActiveKB(null)} />}
    </>
  );
}
