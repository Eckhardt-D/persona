<template>
  <v-container fluid>
    <v-row class="page-title__contain">
      <v-col cols="12">
        <h1 class="page-title">Dashboard</h1>

        <p class="page-description">
          Persona is a tool to generate a public profile page which you can
          point your own domain to with HTTPS automatically enabled 🤓. Tell the
          world about yourself and share your public page everywhere 🚀.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="mx-auto">
        <v-card elevation="0" class="pa-10 form-contain">
          <section ref="form">
            <v-form-edit-mode
              v-if="formOptions.editMode"
              @cancel="formOptions.editMode = false"
            />
            <v-form-default-mode v-else />
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
    formOptions: {
      editMode: false,
      valid: true,
    } as FormOptions,
  }),
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
