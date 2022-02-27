import { MutationTree } from 'vuex'
import { Profile } from './profile'

export interface User {
  id: string
  name: string
  username: string
  email: string
  githubId: string
  bio: string | null
  website: string | null
  profileImage: string | null
  createdAt: Date
  updatedAt: Date
}

export const state = () => ({
  user: null as User | null,
})

export type UserState = ReturnType<typeof state>

export const mutations: MutationTree<UserState> = {
  SET_USER: (state, payload: User | null) => {
    state.user = payload
  },
  UPDATE_USER: (state, payload: Profile) => {
    const user = state.user
    const updated = {
      ...user,
      ...payload,
    } as User
    state.user = updated
  },
}
