// @ts-ignore
import allStyleProvider from 'virtual:style-provider?query=~/*'
import type { LifeCycle } from '../types'

interface Vue2AdapterOptions {
  vueOptions?: Record<string, any>
  lifeCycle?: LifeCycle
}

// TODO 类型定义完善
export function vue2Adapter(
  Vue,
  App,
  { vueOptions = {}, lifeCycle = {} }: Vue2AdapterOptions = {},
) {
  let appWrap
  let app
  let allStyle
  return {
    async bootstrap(props) {
      allStyle = allStyleProvider(props.container)
      lifeCycle?.bootstrap?.(props)
    },
    async mount(props) {
      appWrap = document.createElement('div')
      props.container.appendChild(appWrap)
      allStyle.mount()

      app = new Vue({
        ...vueOptions,
        el: appWrap,
        render: (h) => h(App),
      })
      lifeCycle?.mount?.(props)
    },
    async update(props) {
      lifeCycle?.update?.(props)
    },
    async unmount(props) {
      app.$destroy()
      allStyle.unmount()
      props.container.innerHTML = ''
      appWrap = app = null
      lifeCycle?.unmount?.(props)
    },
    async unload(props) {
      lifeCycle?.update?.(props)
    },
  }
}
