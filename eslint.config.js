// @ts-check

import {
  defineFlatConfig,
  imports,
  javascript,
  markdown,
  typescript,
} from '@bassist/eslint-config'

export default defineFlatConfig([
  ...imports,
  ...javascript,
  ...markdown,
  ...typescript,
])
