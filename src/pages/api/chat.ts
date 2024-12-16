import type { APIRoute } from 'astro'
import type { MessageContent } from 'deep-chat/dist/types/messages'

export const prerender = false

export interface DeepChatTextRequestBody {
  messages: MessageContent[]
  model?: string
  systemPrompt?: string
  overridePrompt?: string
}

export function createReqChatBody(body: DeepChatTextRequestBody, stream?: boolean) {
  // Text messages are stored inside request body using the Deep Chat JSON format:
  // https://deepchat.dev/docs/connect
  const chatBody = {
    messages: body.messages.map((message) => {
      return { role: message.role === 'ai' ? 'assistant' : message.role, content: message.text }
    }),
    model: body.model,
  } as { stream?: boolean }
  if (stream) chatBody.stream = true
  return chatBody
}

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json()) as DeepChatTextRequestBody & {
    systemPrompt: string
  }

  if (body.systemPrompt && !body.messages.find((m) => m.role === 'system')) {
    body.messages.unshift({
      role: 'system',
      text: body.systemPrompt,
    })

    body.systemPrompt = undefined
  }

  if (body.overridePrompt) {
    body.messages.push({
      role: 'system',
      text: body.overridePrompt,
    })
  }

  const newBody = createReqChatBody(body)

  try {
    const response = await fetch(import.meta.env.OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.OPENROUTER_KEY}`,
        'HTTP-Referer': import.meta.env.HTTP_REFERER,
        'X-Title': import.meta.env.X_TITLE,
      },
      body: JSON.stringify(newBody),
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch response' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
