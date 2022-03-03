import Vue from 'vue'
import { MutationTree, ActionTree } from 'vuex'
import { UserState } from './user'

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

export const actions: ActionTree<ProfileState, { user: UserState }> = {
  resetProfile({ commit, rootState }) {
    const user = rootState.user.user
    commit('SET_PROFILE', {
      name: user?.name,
      username: user?.username,
      bio: user?.bio,
      website: user?.website,
      profileImage: user?.profileImage,
    })
  },
  async updateProfile({ commit }, update) {
    const url = 'http://localhost:3002/api/profile'
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(update),
    }).then((res) => res.json())

    commit('user/SET_USER', response, { root: true })
    commit('SET_PROFILE', {
      name: response.name,
      username: response.username,
      bio: response.bio,
      website: response.website,
      profileImage: response.profileImage,
    })
  },
}
