const HF_API_KEY = process.env.REACT_APP_HF_API_KEY

export async function generateAiResponse(mood) {
  const prompt = `Respond kindly to someone who is feeling "${mood}". Keep it short, gentle, and understanding.`

  const response = await fetch(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    },
  )

  const data = await response.json()
  return data?.[0]?.generated_text || "I'm here for you."
}
