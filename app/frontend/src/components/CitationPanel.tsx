import type { Citation } from "../lib/api";

type CitationPanelProps = {
  citations: Citation[];
};

export default function CitationPanel({ citations }: CitationPanelProps) {
  return (
    <section className="panel citation-panel">
      <h3>Constitution References</h3>
      {citations.map((citation) => (
        <article
          key={`${citation.article}-${citation.title}`}
          className="citation-card"
        >
          <p className="citation-meta">{citation.article}</p>
          <h4>{citation.title}</h4>
          <p>{citation.excerpt}</p>
        </article>
      ))}
    </section>
  );
}
