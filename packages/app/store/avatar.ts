import { MutationTree } from 'vuex'

export interface Avatar {
  file: File | null
  isHovering: boolean
  localUrl: string | null
}

export const state = () => ({
  avatar: {
    file: null,
    isHovering: false,
    localUrl: null,
  } as Avatar,
})

export type AvatarState = ReturnType<typeof state>

export const mutations: MutationTree<AvatarState> = {
  SET_AVATAR: (state, payload: File | null) => {
    if (payload !== null) {
      const url = URL.createObjectURL(payload)
      state.avatar.localUrl = url
      state.avatar.file = payload
    } else {
      state.avatar.localUrl = null
      state.avatar.file = null
    }
  },
  SET_AVATAR_HOVERING: (state, payload: boolean) => {
    state.avatar.isHovering = payload
  },
}
