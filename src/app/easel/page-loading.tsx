import { RocketIcon } from '@radix-ui/react-icons'

export function PageLoading() {
  return (
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
  )
}
