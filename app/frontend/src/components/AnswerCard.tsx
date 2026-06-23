import type { ChatResponse } from "../lib/api";

type AnswerCardProps = {
  answer: ChatResponse;
};

export default function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <section className="panel answer-panel">
      <h2>Backend Response</h2>
      <p className="answer-text">{answer.answer}</p>
    </section>
  );
}
