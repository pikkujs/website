import { Link as RLink } from '@tanstack/react-router'
// Docusaurus <Link to="/x"> shim
export default function Link({ to, children, ...p }: any) {
  return <RLink to={to} {...p}>{children}</RLink>
}
