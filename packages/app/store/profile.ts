import Vue from 'vue'
import { MutationTree } from 'vuex'

export interface Profile {
  name: string
  username: string
  bio: string | null
  website: string | null
  profileImage: string | null
}

export const state = () => ({
  profile: {
    name: '',
    username: '',
    bio: null,
    website: null,
    profileImage: null,
  } as Profile,
})

export type ProfileState = ReturnType<typeof state>

export const mutations: MutationTree<ProfileState> = {
  SET_PROFILE: (state, payload) => {
    state.profile = payload
  },
  UPDATE_PROFILE: (state, { key, update }) => {
    Vue.set(state.profile, key, update)
  },
}
