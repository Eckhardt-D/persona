<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        md="6"
        class="d-flex align-center justify-center content-block"
      >
        <div class="authentication">
          <h1>
            <span class="underline">Persona</span> is your public developer
            profile
          </h1>
          <p class="my-2">
            Share your bio with a markdown editor and point your own domain to
            your public page and let the world know who you are and what you do.
          </p>
          <v-btn class="mt-3" @click="githubAuthProviderInit">
            <v-icon>mdi-github</v-icon>
            Authorize with github
          </v-btn>
        </div>
      </v-col>
      <v-col class="d-none d-md-block" cols="12" md="6" :style="style"></v-col>
    </v-row>
  </v-container>
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
  // @ts-ignore:VETUR2769
  layout: 'auth',
  data: () => ({
    style: {
      backgroundImage:
        'url(https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100%',
    },
  }),
  methods: {
    async githubAuthProviderInit() {
      const { state } = await fetch(
        'https://api-azure.kaizen.com.na/api/state'
      ).then((res) => res.json())

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

<style lang="scss">
.content-block {
  min-height: 100vh;
}
.authentication {
  max-width: 600px;
  .underline {
    border-bottom: 5px solid rgb(211, 0, 211);
  }
}
</style>
