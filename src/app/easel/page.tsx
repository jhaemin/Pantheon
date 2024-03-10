'use client'

import { Theme } from '@radix-ui/themes'
import dynamic from 'next/dynamic'
import { PageLoading } from './page-loading'

const EaselInIframe = dynamic(
  () => import('./easel-in-iframe').then((mod) => mod.EaselInIframe),
  {
    ssr: false,
    loading: () => <PageLoading />,
  },
)

export default function EaselPage() {
  return (
    <Theme>
      <EaselInIframe />
    </Theme>
  )
}
