import { defineConfig } from 'vitepress'
import { searchForWorkspaceRoot } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import Container from 'markdown-it-container'
import path from 'path'

const projectRootDir = searchForWorkspaceRoot(process.cwd())
const stripScssMarker = '/* STYLES STRIP IMPORTS MARKER */'

export default defineConfig({
  title: 'OpenCloud Design System',
  description: 'Design System for OpenCloud',
  base: '/',
  vite: {
    resolve: {
      alias: {
        // necessary to allow compiling our live code blocks
        'vue/server-renderer': path.resolve(
          projectRootDir,
          'node_modules/vue/server-renderer/index.js'
        ),
        vue: path.resolve(projectRootDir, 'node_modules/vue/dist/vue.esm-bundler.js')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                @use "sass:math";
                @import "${projectRootDir}/packages/design-system/src/styles/styles";${stripScssMarker};
            `,
          silenceDeprecations: ['legacy-js-api', 'import']
        }
      }
    },
    plugins: [
      {
        name: '@opencloud-eu/vite-plugin-strip-css',
        transform(src, id) {
          if (id.endsWith('.vue') && !id.includes('node_modules') && src.includes('@extend')) {
            console.warn(
              'You are using @extend in your component. This is likely not working in your styles. Please use mixins instead.',
              id.replace(`${projectRootDir}/`, '')
            )
          }
          if (id.includes('lang.scss')) {
            const split = src.split(stripScssMarker)
            const newSrc = split[split.length - 1]

            return {
              code: newSrc,
              map: null
            }
          }
        }
      },
      viteStaticCopy({
        targets: (() => {
          return [
            {
              src: `${projectRootDir}/packages/design-system/src/assets/icons/*`,
              dest: `./components/icons`
            }
          ]
        })()
      }) as any // FIXME: remove type cast once vitepress uses vite 6
    ]
  },

  themeConfig: {
    logo: '', // TODO: add logo
    search: {
      provider: 'local'
    },
    sidebar: {
      '/': [
        {
          text: 'Design Tokens',
          items: [
            {
              text: 'Color palette',
              link: '/designTokens/colorPalette'
            },
            {
              text: 'Font sizes',
              link: '/designTokens/fontSizes'
            },
            {
              text: 'Spacing',
              link: '/designTokens/spacings'
            }
          ]
        },
        {
          text: 'Components',
          base: '/components/',
          items: [
            {
              text: 'OcApplicationIcon',
              link: '/OcApplicationIcon'
            },
            {
              text: 'OcAvatar',
              link: '/OcAvatar'
            },
            {
              text: 'OcAvatarCount',
              link: '/OcAvatarCount'
            },
            {
              text: 'OcAvatarItem',
              link: '/OcAvatarItem'
            },
            {
              text: 'OcAvatars',
              link: '/OcAvatars'
            },
            {
              text: 'OcBreadcrumb',
              link: '/OcBreadcrumb'
            },
            {
              text: 'OcButton',
              link: '/OcButton'
            },
            {
              text: 'OcTextarea',
              link: '/OcTextarea'
            },
            {
              text: 'OcTextInput',
              link: '/OcTextInput'
            }
          ]
        }
      ]
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/opencloud-eu/web/tree/main/packages/design-system'
      },
      {
        icon: 'matrix',
        link: 'https://app.element.io/#/room/#opencloud:matrix.org'
      }
    ]
  },
  markdown: {
    config: (md) => {
      md.use(Container, 'livecode', {
        render: (tokens: Array<Record<string, any>>, idx: number) => {
          if (tokens[idx].info.includes('livecode')) {
            const path = tokens[idx].attrs?.[0]?.[1]
            return `<live-code-block path="${path || ''}">`
          }
          return '</live-code-block>'
        }
      })
    }
  },
  rewrites: {
    'components/:name/:slug*': 'components/:slug*'
  }
})
