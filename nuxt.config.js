import colors from 'vuetify/es5/util/colors'
// import path from 'path'
// import fs from 'fs'

export default {
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
  //     cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt'))
  //   }
  // },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - syscom',
    title: 'PosPuc',
    htmlAttrs: {
      lang: 'pt-br'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/resets.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/admdigital.js',
    '~/plugins/filters.js',
    '~/plugins/vmask.js',
    '~/plugins/vuemq.js',
    { src:'~/plugins/dragscroll.js', mode: 'client'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-vuex-localstorage'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    headers: {
      'content-type': 'application/json'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  auth: {
    strategies: {
      local: {
        token: {
          maxAge: 86400
        },
        endpoints: {
          login: {
            //url: 'https://erpapi.admdigital.com.br/v1',
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            }
          },
          logout: false,
          user: false
        }
      }
    }
  },

  router: {
    base: '/syscom'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
