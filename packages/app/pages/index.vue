<template>
  <v-container fluid>
    <p class="text-center">
      Your public link is
      <a
        v-if="
          !$store.state.user.user.customDomain ||
          !$store.state.user.user.customDomainVerified
        "
        :href="`${$config.static_url}/${$store.state.user.user.id}`"
        >{{ $config.static_url }}/{{ $store.state.user.user.id }}</a
      >
      <a
        v-else
        :href="`https://${$store.state.user.user.customDomain}/${$store.state.user.user.id}`"
        >{{ $config.static_url }}/{{ $store.state.user.user.id }}</a
      >
    </p>
    <v-row class="page-title__contain">
      <v-col cols="12">
        <h1 class="page-title">Dashboard</h1>

        <p class="page-description">
          Persona is a tool to generate a public profile page which you can
          point your own domain to with HTTPS automatically enabled 🤓. Tell the
          world about yourself and share your public page everywhere 🚀.
        </p>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <h1 class="page-title">Domain Management</h1>

        <p class="page-description">
          Add your domain and point it to dns-azure.kaizen.com.na To see your
          public profile on your own domain.
        </p>
        <v-form ref="domainForm" v-model="domainValid">
          <v-text-field
            v-model="domain"
            :disabled="!!$store.state.user.user.customDomain"
            :rules="domainRules"
            placeholder="profile.domain.com"
            outlined
            :append-icon="iconDomainStatus"
            appen
            dense
          />
          <p v-if="!$store.state.user.user.customDomainVerified" class="mt-0">
            <small
              >Your domain has not been verified yet, please make sure it is
              CNAMED to dns-azure.kaizen.com.na</small
            >
          </p>
          <v-btn
            v-if="!$store.state.user.user.customDomain"
            color="primary"
            @click="addDomain"
            >Submit</v-btn
          >
          <v-btn v-else color="warning" @click="deleteDomain"
            >Delete Domain</v-btn
          >
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="mx-auto">
        <v-card elevation="0" class="pa-10 form-contain">
          <section ref="form">
            <client-only>
              <v-form-edit-mode
                v-if="formOptions.editMode"
                @cancel="formOptions.editMode = false"
              />
              <v-form-default-mode v-else />
            </client-only>
          </section>
          <v-card-actions>
            <v-btn
              v-if="!formOptions.editMode"
              class="ml-auto"
              color="primary"
              outlined
              small
              @click="formOptions.editMode = !formOptions.editMode"
              >Edit</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="error">{{ errorMessage }}</v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

interface FormOptions {
  editMode: boolean
  valid: boolean
}

export default Vue.extend({
  name: 'DashboardPage',
  data: () => ({
    error: false,
    errorMessage: '',
    domain: '',
    domainValid: true,
    formOptions: {
      editMode: false,
      valid: true,
    } as FormOptions,
  }),
  computed: {
    domainRules() {
      return [
        (v: string) =>
          (!!v && this.validDomain(v)) || 'Domain must be valid domain',
      ]
    },
    iconDomainStatus() {
      return this.$store.state.user.user.customDomain &&
        this.$store.state.user.user.customDomainVerified
        ? 'mdi-check'
        : 'mdi-minus-circle-outline'
    },
  },
  watch: {
    error(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.error = false
        }, 3000)
      }
    },
  },
  mounted() {
    this.domain = this.$store.state.domain.domain || ''
  },
  methods: {
    async addDomain() {
      if (this.validDomain(this.domain)) {
        const url = `${this.$config.api_url}/api/domain/add`

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              id: this.$store.state.user.user.id,
              domain: this.domain,
            }),
          }).then((res) => res.json())

          if (response.id) {
            this.$store.commit('user/SET_USER', response)
            this.$store.commit('domain/SET_DOMAIN', this.domain)
          } else {
            throw new Error('Failed to create this domain.')
          }
        } catch (err) {
          this.error = true
          this.errorMessage = err.message
        }
      }
    },
    async deleteDomain() {
      if (this.validDomain(this.domain)) {
        const url = `${this.$config.api_url}/api/domain/add`

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              id: this.$store.state.user.user.id,
              domain: null,
            }),
          }).then((res) => res.json())

          if (response.id) {
            this.$store.commit('user/SET_USER', response)
            this.$store.commit('domain/SET_DOMAIN', null)
            this.domain = ''
            ;(this.$refs.domainForm as any).reset()
          } else {
            throw new Error('Failed to create this domain.')
          }
        } catch (err) {
          this.error = true
          this.errorMessage = err.message
        }
      }
    },
    validDomain(domain: string) {
      return /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/.test(
        domain
      )
    },
  },
})
</script>

<style>
.page-title__contain {
  padding: 1rem 0;
}

.page-title {
  font-weight: 500;
}

.form-contain {
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
}

.form-section {
  display: flex;
  align-items: center;
}

.form-section--noflex {
  display: block;
}

.profile-bio {
  text-align: justify;
}
</style>
