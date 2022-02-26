import { Context, Middleware } from '@nuxt/types'
import * as Cookie from 'cookie'
import * as JsCookie from 'js-cookie'
import { User } from '~/store/user'

const blockedPaths: string[] = ['/']

const middleware: Middleware = async (context: Context) => {
  const { req, redirect, route, $axios, store } = context
  const isBlocked = blockedPaths.some((p) => p.match(route.path))
  if (!isBlocked) return

  if (store.state.user.user) {
    return
  }

  const serverCookie = process.server
    ? (req.headers.cookie && Cookie.parse(req.headers.cookie).persona_token) ||
      ''
    : ''

  const token = process.client ? JsCookie.get('persona_token') : serverCookie

  if (!token) {
    return redirect('/auth')
  }

  const validateUrl = 'http://localhost:3002/api/token/validate'

  try {
    const response: User = await $axios.$post(validateUrl, {
      token,
    })

    store.commit('user/SET_USER', response)
    store.commit('profile/SET_PROFILE', {
      bio: response.bio,
      name: response.name,
      website: response.website,
      username: response.username,
      profileImage: response.profileImage,
    })
  } catch (__) {
    return redirect('/auth')
  }
}

export default middleware
