import fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import { createPool, sql } from 'slonik'

const app = new Koa()
const router = new Router()

const pool = createPool('postgresql://todo_user:todo_user@localhost/todos')
pool.connect(async (connection) => {
  await connection.query(sql`SELECT * FROM todo`)
})

router.get('/', async (ctx) => {
  const html = await fs.promises.readFile('./src/client/index.html', 'utf-8')
  ctx.body = html
  //   if (html) {
  //     ctx.body = html
  //   } else {
  //     ctx.body = 'error'
  //   }
})

router.get('/todos', async (ctx) => {
  const todos = await pool.query(sql`SELECT * FROM todo`)
  ctx.body = JSON.stringify(todos)
})

//serve를 해줘야 build 파일을 찾음
app.use(serve('./build'))
app.use(bodyparser())
app.use(router.routes())

app.listen(4000)
