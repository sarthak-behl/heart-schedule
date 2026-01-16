import OpenAI from "openai"

// Lazy-load OpenAI client to avoid build-time initialization
let openaiClient: OpenAI | null = null

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://heartschedule.app",
        "X-Title": "HeartSchedule",
      },
    })
  }
  return openaiClient
}

export type MessageTone = "warm" | "formal" | "casual" | "heartfelt"
export type Occasion = "birthday" | "anniversary" | "apology" | "gratitude" | "congratulations" | "just_because" | "custom"

interface GenerateMessageParams {
  occasion: Occasion
  recipientName?: string
  tone: MessageTone
  context: string // What the user wants to say
}

interface GeneratedMessage {
  subject: string
  body: string
}

const toneDescriptions = {
  warm: "warm and friendly",
  formal: "professional and respectful",
  casual: "relaxed and conversational",
  heartfelt: "deeply emotional and sincere",
}

const occasionTemplates = {
  birthday: "a birthday message",
  anniversary: "an anniversary message",
  apology: "an apology message",
  gratitude: "a gratitude/thank you message",
  congratulations: "a congratulations message",
  just_because: "a thoughtful message for no particular occasion",
  custom: "a personalized message",
}

export async function generateMessage(params: GenerateMessageParams): Promise<GeneratedMessage> {
  const { occasion, recipientName, tone, context } = params

  const recipientText = recipientName ? ` for ${recipientName}` : ""
  const occasionText = occasionTemplates[occasion]
  const toneText = toneDescriptions[tone]

  const systemPrompt = `You are an expert at writing heartfelt, personal messages for special occasions. Your goal is to help people express their emotions authentically and meaningfully.

Guidelines:
- Write in a ${toneText} tone
- Keep messages concise but impactful (2-4 paragraphs)
- Be specific and personal when context is provided
- Avoid clichés and generic phrases
- Make it feel genuine and from the heart
- Do not use emojis unless specifically requested
- Write in a way that sounds natural when read aloud`

  const userPrompt = `Write ${occasionText}${recipientText} with a ${toneText} tone.

Context from the sender: ${context}

Please provide:
1. An appropriate email subject line (short and engaging)
2. The message body (warm, personal, and heartfelt)

Format your response exactly as follows:
SUBJECT: [your subject line here]

BODY:
[your message body here]`

  try {
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: "allenai/molmo-2-8b:free", // Free AllenAI Molmo model for text generation
      messages: [
        { role: "user", content: `${systemPrompt}\n\n${userPrompt}` },
      ],
      temperature: 0.8, // Higher temperature for more creative, varied responses
      max_tokens: 1000,
    })

    const responseText = completion.choices[0]?.message?.content || ""

    // Parse the response
    const subjectMatch = responseText.match(/SUBJECT:\s*(.+?)(?:\n|$)/i)
    const bodyMatch = responseText.match(/BODY:\s*\n([\s\S]+?)$/i)

    if (!subjectMatch || !bodyMatch) {
      throw new Error("Failed to parse AI response")
    }

    return {
      subject: subjectMatch[1].trim(),
      body: bodyMatch[1].trim(),
    }
  } catch (error) {
    console.error("Error generating message with OpenRouter:", error)
    throw new Error("Failed to generate message. Please try again.")
  }
}
