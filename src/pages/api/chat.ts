import { getStore } from '@netlify/blobs'
import type { APIRoute } from 'astro'
import type { MessageContent } from 'deep-chat/dist/types/messages'

export const prerender = false

export interface DeepChatTextRequestBody {
  messages: MessageContent[]
  model?: string
  systemPrompt?: string
  overridePrompt?: string
  messageLimit?: number
  messageLimitOverridePrompt?: string
}

export interface StoredChat {
  visitorId: string
  messages: MessageContent[]
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

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = (await request.json()) as DeepChatTextRequestBody & {
    systemPrompt: string
  }

  const chatStore = getStore('chat')
  const visitorId = cookies.get('visitor-id')?.value

  let storedChat: StoredChat | null = null
  let currentChat: MessageContent[] = []
  try {
    storedChat = JSON.parse((await chatStore.get(visitorId)) || 'null') as StoredChat | null

    if (!storedChat) {
      storedChat = {
        visitorId: visitorId,
        messages: body.messages,
      }
    } else {
      storedChat.messages.push(...body.messages)
    }

    currentChat = storedChat.messages
  } catch (e) {
    console.error('Error retrieving chat', e)
  }

  if (body.systemPrompt && !currentChat.find((m) => m.role === 'system')) {
    currentChat.unshift({
      role: 'system',
      text: body.systemPrompt,
    })

    body.systemPrompt = undefined
  }

  if (body.messageLimit && currentChat.length > body.messageLimit) {
    currentChat.push({
      role: 'system',
      text: body.messageLimitOverridePrompt,
    })
  } else if (body.overridePrompt) {
    currentChat.push({
      role: 'system',
      text: body.overridePrompt,
    })
  }

  const newBody = createReqChatBody({
    ...body,
    messages: currentChat,
  })

  let data: object = null
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

    data = await response.json()
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch response' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  try {
    if (data && 'choices' in data && data.choices?.[0]?.message?.content) {
      storedChat.messages.push({
        role: 'assistant',
        text: data.choices[0].message.content,
      })
    }

    await chatStore.set(visitorId, JSON.stringify(storedChat))
  } catch (e) {
    console.error('Error storing chat', e)
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
