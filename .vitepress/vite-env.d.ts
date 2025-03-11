/// <reference types="vite/client" />

declare module '*.vue' {
  import { type DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module '*.md' {
  // eslint-disable-next-line no-duplicate-imports
  import { type DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}
