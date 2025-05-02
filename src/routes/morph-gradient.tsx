import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/morph-gradient')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/morph-gradient"!</div>
}
