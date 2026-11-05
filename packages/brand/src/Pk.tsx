import type { SVGProps } from 'react'

export type PkProps = Omit<SVGProps<SVGSVGElement>, 'color' | 'title'> & {
  size?: number | string
  title?: string
  color?: string
}

/** The Pikku chameleon. Takes currentColor unless `color` is set; needs <SvgDefs /> on the page. */
export function Pk({ size, title, color, style, ...rest }: PkProps) {
  return (
    <svg
      width={size}
      height={size}
      style={{ color, overflow: 'visible', ...style }}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <use href="#pk" width="100%" height="100%" />
    </svg>
  )
}
