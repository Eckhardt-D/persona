import markdown from 'markdown-it'
import hljs from 'highlight.js'
import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

export default (_: Context, inject: Inject) => {
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
        '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
      )
    },
  })

  const render = (str: string) => {
    return md.render(str)
  }

  inject('md', render)
}
