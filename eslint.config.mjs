import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'scripts/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Library boundary law (architecture 4.1): GSAP and Framer Motion may only
    // be imported by the files that own those animation tiers.
    files: [
      'components/sections/**/*.tsx',
      'components/layout/**/*.tsx',
      'components/ui/**/*.tsx',
      'components/media/**/*.tsx',
      'app/**/*.tsx',
    ],
    // The named motion owners — every one appears on the client-component
    // census. A file not on this list may not import an animation library.
    ignores: [
      'components/sections/home/StringLine.tsx',
      'components/sections/home/SpecStrip.tsx',
      'components/sections/services/ElevationDiagram.tsx',
      'components/sections/shared/FooterMonument.tsx',
      'components/sections/work/WorkLedger.tsx',
      'components/sections/work/ProjectPreview.tsx',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'gsap', message: 'GSAP is owned by components/motion and lib/motion only.' },
            { name: '@gsap/react', message: 'GSAP is owned by components/motion and lib/motion only.' },
            { name: 'framer-motion', message: 'Framer Motion is limited to its four approved files.' },
          ],
        },
      ],
    },
  },
]

export default config
