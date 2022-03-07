<template>
  <h1>Verifying...</h1>
</template>

<script lang="ts">
import Vue from 'vue'
import * as cookie from 'js-cookie'

export default Vue.extend({
  name: 'AuthVerify',
  async mounted() {
    const { query } = this.$route

    if (query.error) {
      setTimeout(() => {
        this.$router.push('/auth')
      }, 3000)

      return this.$nuxt.error({
        statusCode: 500,
        message:
          'Oops, could not authenticate please try again. Redirecting...',
      })
    }

    if (query.code) {
      const url = `${this.$config.api_url}/api/authorize`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          code: query.code,
          state: query.state,
        }),
        redirect: 'follow',
      }).then((res) => res.json())

      if (response.error || !response.token) {
        return this.$nuxt.error({
          statusCode: 401,
          message: response.error.message,
        })
      }

      const { token } = response
      cookie.set('persona_token', token)

      this.$router.push('/')
    }
  },
})
</script>
