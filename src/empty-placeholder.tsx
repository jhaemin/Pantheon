export function EmptyPlaceholder({ name }: { name?: string }) {
  return (
    <span
      style={{
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '3px 6px',
        borderRadius: 3,
        fontSize: 13,
      }}
    >
      Empty{name ? ` ${name}` : ''}
    </span>
  )
}
