import Button from '@/components/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (<div className='w-full h-full min-h-screen min-w-screen'>
    <h1>Hello World</h1>
    <Button>Click me</Button>
  </div>)
}