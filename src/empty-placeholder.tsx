export function EmptyPlaceholder({ name }: { name?: string }) {
  return (
    <span
      style={{
        color: '#000',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #000',
        padding: '2px 8px',
        borderRadius: 3,
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      Empty{name ? ` ${name}` : ''}
    </span>
  )
}
