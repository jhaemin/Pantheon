export function EmptyPlaceholder({ name, ...rest }: { name?: string }) {
  return (
    <span
      {...rest}
      style={{
        // display: 'inline-flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        color: '#000',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        // border: '1px solid #000',
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
