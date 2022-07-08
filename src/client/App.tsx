import * as React from 'react'
import './styles.css'

interface Todo {
  id: number
  content: string
  done: boolean
}

export default function App() {
  const [todoInput, setTodoInput] = React.useState('')
  const [todos, setTodos] = React.useState<Todo[]>([])

  const refetch = React.useCallback(async () => {
    const fetched = await fetch('/todos')
    const data = await fetched.json()
    setTodos(data.rows)
  }, [])

  React.useEffect(() => {
    refetch()
  }, [refetch])

  const onChangeTextInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTodoInput(e.target.value)
  }

  const createTodo = async (text: string) => {
    await fetch('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })
    refetch()
  }

  const updateTodo = async (id: number, done: boolean) => {
    await fetch(`/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ done }),
    })
    refetch()
  }

  const deleteTodo = async (id: number) => {
    await fetch(`/todos/${id}`, {
      method: 'DELETE',
    })
    refetch()
  }

  return (
    <div className='container'>
      {/*title*/}
      <div className='title'>todo list 1</div>
      {/*input*/}
      <input
        className='inputBox'
        value={todoInput}
        onChange={onChangeTextInput}
        onKeyPress={(e) => {
          if (e.code === 'Enter') {
            createTodo(todoInput)
            setTodoInput('')
          }
        }}
      />
      {/*todo list*/}
      <div className='todoList'>
        {todos.map((todo) => (
          <div
            key={todo.id}
            className='todoBox'
            style={{ backgroundColor: todo.done ? 'gray' : 'white' }}
          >
            <div
              className='doneBox'
              onClick={() => {
                updateTodo(todo.id, !todo.done)
              }}
            />
            <div className='textBox'>{todo.content}</div>
            <div
              className='doneBox'
              onClick={() => {
                deleteTodo(todo.id)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
