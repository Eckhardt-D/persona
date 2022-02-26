<template>
  <div class="authentication">
    <h1>Authenticate</h1>
    <v-btn @click="githubAuthProviderInit">
      <v-icon>mdi-github</v-icon>
      Authorize with github
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface GithubAuthOptions {
  client_id: string
  redirect_uri: string
  scope: string
  allow_signup: 'false'
  state: string
}

export default Vue.extend({
  name: 'AuthPage',
  methods: {
    async githubAuthProviderInit() {
      const { state } = await fetch('http://localhost:3002/api/state').then(
        (res) => res.json()
      )

      const options: GithubAuthOptions = {
        client_id: this.$config.github.client_id,
        redirect_uri: this.$config.github.redirect_uri,
        scope: this.$config.github.scope,
        allow_signup: 'false',
        state,
      }

      const url = `${this.$config.github.auth_url}?client_id=${options.client_id}&redirect_uri=${options.redirect_uri}&scope=${options.scope}&allow_signup=${options.allow_signup}&state=${options.state}`
      location.assign(url)
    },
  },
})
</script>
