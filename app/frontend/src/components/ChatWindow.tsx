import { ChangeEvent, FormEvent, useState } from "react";

type ChatWindowProps = {
  onSubmitMessage: (message: string) => Promise<void>;
  loading: boolean;
};

export default function ChatWindow({
  onSubmitMessage,
  loading,
}: ChatWindowProps) {
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading) {
      return;
    }

    await onSubmitMessage(trimmed);
    setMessage("");
  }

  return (
    <section className="panel chat-panel">
      <h2>Explain Your Case</h2>
      <p>
        Share what happened in plain language.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setMessage(event.target.value)
          }
          placeholder="Example: I was stopped from joining a peaceful protest and denied explanation..."
          rows={7}
        />
        <div className="btn-area">
        <button type="submit" disabled={loading}>
          {loading
            ? "Making research..."
            : "Get Insights"}
        </button>

        </div>
      </form>
    </section>
  );
}
