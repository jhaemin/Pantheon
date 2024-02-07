'use client'

import { RocketIcon } from '@radix-ui/react-icons'
import { Theme } from '@radix-ui/themes'
import dynamic from 'next/dynamic'

const EaselInIframe = dynamic(
  () => import('./easel-in-iframe').then((mod) => mod.EaselInIframe),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RocketIcon width={50} height={50} />
      </div>
    ),
  },
)

export default function EaselPage() {
  return (
    <Theme>
      <EaselInIframe />
    </Theme>
  )
}
