import { defineMiddleware } from 'astro:middleware'
import crypto from 'node:crypto'

export const onRequest = defineMiddleware((context, next) => {
  // Set visitor-id cookie on every request
  if (!context.cookies.get('visitor-id')) {
    context.cookies.set('visitor-id', crypto.randomUUID(), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    })
  }

  return next()
})
