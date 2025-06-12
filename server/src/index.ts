import { Hono } from 'hono'
import userRoute from './routes/user.route'
import blogRouter from './routes/blog.route'

const app = new Hono()

app.get('/', (c) => {
  return c.text('yamdoot world', 200)
})

app.route('/api/v1/user', userRoute)
app.route("/api/v1/blog", blogRouter)

export default app

