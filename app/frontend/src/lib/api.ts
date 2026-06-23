export type Citation = {
  article: string;
  title: string;
  excerpt: string;
};

export type ChatResponse = {
  answer: string;
};


export async function askConstitutionAssistant(
  message: string,
): Promise<ChatResponse> {
  const response = await fetch(`/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Unable to get response from constitutional assistant.");
  }

  return response.json() as Promise<ChatResponse>;
}
