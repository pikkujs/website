/** Logo + title header on integration docs. `image` names a light asset; the dark theme swaps `light` for `dark`.
 *  Both images are rendered and the theme picks one in CSS, so there is no flash and no hydration mismatch. */
export function DocHeaderHero({ image, title }: { image?: string; title?: string }) {
  const dark = image?.replace('light', 'dark')
  return (
    <div className="pk-hero">
      {image && <img className={dark && dark !== image ? "themed-img-light" : undefined} width={88} height={88} src={image} alt={`Logo for ${title}`} />}
      {image && dark && dark !== image && <img className="themed-img-dark" width={88} height={88} src={dark} alt="" aria-hidden="true" />}
      <h1>{title}</h1>
    </div>
  )
}
