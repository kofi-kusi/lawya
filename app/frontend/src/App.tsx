import { useState } from "react";
import AnswerCard from "./components/AnswerCard";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import logo from "./assets/scales-justice-symbol-law-legal-system.png";
import { askConstitutionAssistant, type ChatResponse } from "./lib/api";

export default function App() {
  const [answer, setAnswer] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmitMessage(message: string) {
    setLoading(true);
    setError(null);

    try {
      const result = await askConstitutionAssistant(message);
      setAnswer(result);
    } catch {
      setError("Unable to process your request right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Sidebar />
      <main>
        <div className="app-shell">
          <header className="hero">
            <div className="col">
              <img src={logo} alt="logo" className="logo" />
              <h1 className="eyebrow">Lawya</h1>
            </div>
            <p>
              This tool generates legal insights, cites relevant constitutional
              provisions and other authorities, and suggests practical next
              steps to streamline lawyers' workflows.
            </p>
          </header>

          <ChatWindow onSubmitMessage={onSubmitMessage} loading={loading} />

          {error && <p className="error-banner">{error}</p>}

          {answer && <AnswerCard answer={answer} />}
        </div>
      </main>
    </>
  );
}
