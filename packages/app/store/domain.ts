import { MutationTree } from 'vuex'

export const state = () => ({
  domain: '',
})

export type DomainState = ReturnType<typeof state>

export const mutations: MutationTree<DomainState> = {
  SET_DOMAIN: (state, payload) => {
    state.domain = payload
  },
}
