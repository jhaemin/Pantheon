// export type PropsWithoutChildren<P> = Omit<P, 'children'>
// export type PropsWithoutChildren<P> = P & { children?: never }
export type PropsWithoutChildren<P> = P extends { children: any }
  ? Omit<P, 'children'>
  : P
