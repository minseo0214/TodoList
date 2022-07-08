import * as fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import { createPool, sql } from 'slonik'

const app = new Koa()
const router = new Router()

const pool = createPool('postgresql://todo_user:todo_user@localhost/todos2')
pool.connect(async (connection) => {
  await connection.query(sql`SELECT * FROM todo`)
})

//CRUD (create, read, update, delete)
router.get('/', async (ctx) => {
  const html = await fs.promises.readFile('./src/client/index.html', 'utf-8')
  ctx.body = html
})

router.get('/todos', async (ctx) => {
  const todos = await pool.query(sql`SELECT * FROM todo ORDER BY id desc`)
  ctx.body = JSON.stringify(todos)
})

router.post('/todos', async (ctx) => {
  const { text } = ctx.request.body
  await pool.query(
    sql`INSERT INTO todo (content, done) values (${text}, false)`
  )
  ctx.status = 200
})

//update로 했을 때 왜 crash가 나지?
router.patch('/todos/:id', async (ctx) => {
  const { id } = ctx.params
  const { done } = ctx.request.body
  if (!id) {
    ctx.status = 400
    return
  }
  await pool.query(sql`UPDATE todo SET done = ${done} WHERE id = ${id}`)
  ctx.status = 200
})

router.delete('/todos/:id', async (ctx) => {
  const { id } = ctx.params
  if (!id) {
    ctx.status = 400
    return
  }
  await pool.query(sql`DELETE FROM todo where id=${id}`)
  ctx.status = 200
})

//serve를 해줘야 build 파일을 찾음
app.use(serve('./build'))
app.use(bodyparser())
app.use(router.routes())

app.listen(4000)
