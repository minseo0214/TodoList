import * as React from 'react'
import './styles.css'

interface Todo {
  id: number
  text: string
  done: boolean
}

export default function App() {
  const [text, setText] = React.useState('')
  const [todos, setTodos] = React.useState([])

  return <div>bye</div>
}
