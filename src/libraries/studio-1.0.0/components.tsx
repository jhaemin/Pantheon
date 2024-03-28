function Text(props: any) {
  return <span {...props}>{props.value}</span>
}

function Page(props: any) {
  return <div {...props}>{props.children}</div>
}

function Image(props: any) {
  return <img alt={props.alt} {...props} />
}

export const components = {
  Text,
  Page,
  Image,
}
