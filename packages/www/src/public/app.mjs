/* eslint-disable */
const hljs = window.hljs;
const md = window.markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs text-left p-2"><code class="text-left">' +
          hljs.highlight(str, {language: lang, ignoreIllegals: true}).value +
          '</code></pre>'
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs text-left p-2"><code class="text-left">' +
      md.utils.escapeHtml(str) +
      '</code></pre>'
    );
  },
});

const bioContain = document.getElementById('bio-contain');
const raw = bioContain.innerText.trim();
const parsed = md.render(raw);
bioContain.innerHTML = parsed;
bioContain.style.display = 'block';
