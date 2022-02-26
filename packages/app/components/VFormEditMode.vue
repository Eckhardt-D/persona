<template>
  <main>
    <h1 class="mb-7">Edit Mode</h1>

    <div class="form-section">
      <v-avatar ref="avatar" style="align-self: flex-start" size="80">
        <v-img
          :src="
            useCustom ? avatarSettings.avatar.imageUrl : options.avatar.imageUrl
          "
          @mouseenter="showUploadState"
          @mouseleave="hideUploadState"
        >
          <transition name="fade">
            <div v-if="options.avatar.isHovering" class="upload-overlay">
              <input
                id="uploader"
                type="file"
                accept="image/jpeg, image/png"
                @change="setAvatarUrl"
              />
              <v-icon>mdi-camera-outline</v-icon>
            </div>
          </transition>
        </v-img>
      </v-avatar>
      <section class="ml-7">
        <v-text-field
          v-model="options.name"
          outlined
          dense
          label="Edit your name"
          value="John Doe"
        />
        <v-text-field
          v-model="options.website"
          outlined
          dense
          label="Edit your website link"
        ></v-text-field>
      </section>
    </div>
    <div class="form-section--noflex mt-5">
      <h3 class="mb-2">Your story</h3>
      <div class="text-right">
        <v-btn text @click="preview = !preview"> Toggle preview </v-btn>
      </div>
      <v-textarea
        v-if="!preview"
        v-model="options.bio"
        outlined
        label="Edit your bio"
      />
      <div
        v-else
        outlined
        disabled
        label="Preview mode"
        v-html="processedBio"
      />
    </div>
  </main>
</template>

<script lang="ts">
// @TODO: Refactor to store Form module.
import Vue from 'vue'
import markdown from 'markdown-it'
import hljs from 'highlight.js'
import { mapState } from 'vuex'

export interface Avatar {
  isHovering: boolean
  hasFile: boolean
  file?: File | null
  imageUrl: string
}

export interface FormOptions {
  avatar: Avatar
  bio: string
  name: string
  website: string
}

export default Vue.extend({
  name: 'FormEdit',
  data: () => ({
    avatarSettings: {
      avatar: {
        isHovering: false,
        hasFile: false,
        file: null,
        imageUrl: '/avatar.jpg',
      } as Avatar,
    },
    preview: false,
    useCustom: false,
  }),
  computed: {
    ...mapState('user', ['user']),
    options() {
      return {
        avatar: this.user.profileImage
          ? { ...this.avatarSettings.avatar, imageUrl: this.user.profileImage }
          : this.avatarSettings.avatar,
        bio: this.user.bio || '',
        name: this.user.name,
        website:
          this.user.website || `https://github.com/${this.user.username}`,
      } as FormOptions
    },
    avatarSource: {
      get() {
        return this.avatarSettings.avatar.imageUrl
      },
      set(value: Event) {
        const files: FileList | null = (value.target as HTMLInputElement).files

        if (files && files[0]) {
          const file = files[0]
          const url: string = URL.createObjectURL(file)

          this.avatarSettings.avatar.hasFile = true
          this.avatarSettings.avatar.file = file
          this.avatarSettings.avatar.imageUrl = url
          this.useCustom = true
          return
        }

        this.avatarSettings.avatar.hasFile = false
        this.avatarSettings.avatar.file = null
        this.avatarSettings.avatar.imageUrl =
          this.user.profileImage || '/avatar.jpg'
        this.useCustom = false
      },
    },
    processedBio(): string {
      const md = markdown({
        highlight(str: string, lang: string) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return (
                '<pre class="hljs"><code>' +
                hljs.highlight(str, { language: lang, ignoreIllegals: true })
                  .value +
                '</code></pre>'
              )
            } catch (__) {}
          }
          return (
            '<pre class="hljs"><code>' +
            md.utils.escapeHtml(str) +
            '</code></pre>'
          )
        },
      })

      return md.render((this.options as FormOptions).bio)
    },
  },
  methods: {
    showUploadState() {
      this.avatarSettings.avatar.isHovering = true
    },
    hideUploadState() {
      this.avatarSettings.avatar.isHovering = false
    },
    setAvatarUrl(payload: Event) {
      this.avatarSource = payload
    },
    resetForm() {
      this.avatarSettings.avatar.imageUrl = this.user.profileImage
      this.useCustom = false
    },
  },
})
</script>

<style>
.upload-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.upload-overlay .v-icon {
  color: white;
}

.upload-overlay #uploader {
  opacity: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  cursor: pointer;
}

/* we will explain what these classes do next! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
