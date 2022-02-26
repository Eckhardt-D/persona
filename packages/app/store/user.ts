import { MutationTree } from 'vuex'

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
}
