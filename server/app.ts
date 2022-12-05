import * as express from "express"
import { NextFunction, Request, Response } from "express"
import * as bodyParser from "body-parser"
import * as cookieParser from "cookie-parser"
import * as session from "express-session"
import * as path from "path"
import { errorHandler } from "./src/exceptions/errorHandler"
require("express-async-errors") //捕获异步中的异常
import { expressjwt } from "express-jwt"

// 创建并设置express app
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 跨域
let allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Referer') ? req.get('Referer').slice(0, -1) : '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , X-Token')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  if (req.method == 'OPTIONS') {
      res.sendStatus(204)
  } else {
      next()
  }
}
app.use(allowCrossDomain)

// session
app.use(cookieParser('secret'))
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: true, // 是否保存未初始化的会话
    cookie: {
        maxAge: 3600000 * 72, // 设置 session 的有效时间，单位毫秒
    },
}))

// 配置静态资源
app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.use('/static', express.static(path.join(__dirname, 'static')))

// jwt
app.use(expressjwt({
    secret: 'secret',
    algorithms: ["HS256"]
}).unless({
    path: ['/adminUser/captcha', '/adminUser/login']
}))

// 路由
import { adminUser } from './src/routes/admin/user'
import { adminRole } from './src/routes/admin/role'
app.use('/adminUser', adminUser)
app.use('/adminRole', adminRole)

// 统一处理异常
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    errorHandler.handleError(err, res)
})

// 启动 express server
app.listen(3000)