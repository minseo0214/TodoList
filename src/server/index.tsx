import fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'

const app = new Koa()
const router = new Router()

router.get('/', async (ctx) => {
  const html = await fs.promises.readFile('./src/client/index.html', 'utf-8')
  ctx.body = html
  //   if (html) {
  //     ctx.body = html
  //   } else {
  //     ctx.body = 'error'
  //   }
})

//serve를 해줘야 build 파일을 찾음
app.use(serve('./build'))
app.use(bodyparser())
app.use(router.routes())

app.listen(4000)
