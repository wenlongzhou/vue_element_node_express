import * as express from "express"
import { AppError } from "../../exceptions/appError"
import { AdminUser } from "../../entity/adminUser"
import { AdminRole } from "../../entity/adminRole"
import * as jwt from "jsonwebtoken"
import { appDataSource } from "../../../appDataSource"
let router = express.Router()
let svgCaptcha = require('svg-captcha')

/**
 * 验证码
*/
router.get('/captcha', function (req:any, res) {
  var captcha = svgCaptcha.create({
    size: 4,  //验证码长度
    width: 100, //svg宽度
    height: 50, //svg高度
    noise: 2, //干扰线条数
    fontSize: 35, //字体大小
    ignoreChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxz',   //验证码字符中排除
    color: false // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有           
  })
  req.session.captcha = captcha.text
  req.session.a = "aaa"
  console.log(11111)
  console.log(req.session.captcha)
  
  res.type('svg')
  res.json({ captcha: captcha.data })
})

/**
 * 登录
*/
router.post('/login', async (req, res, next) => {
  let { user, password, captcha } = req.body

  if (!user || !password) {
    throw new AppError('用户名密码不能为空！')
  }

  if (captcha !== req.session.captcha) {
    throw new AppError('验证码错误！')
  }

  const userInfo = await AdminUser.findOneBy({user, password})
  if (!userInfo) {
    throw new AppError('用户名或密码错误！')
  }

  const token = 'Bearer ' + jwt.sign({ ...userInfo }, 'secret', { expiresIn: 3600 * 24 * 3} )
  
  res.json({ token })
})

/**
 * 获取用户信息
*/
router.get('/userInfo', async (req, res, next) => {
  // 获取权限
  const rolesData = await appDataSource
  .getRepository(AdminUser)
  .createQueryBuilder("u")
  .leftJoinAndSelect(AdminRole, "role", 'find_in_set(role.id, u.role_ids)')
  .where('u.id = :uid', { uid: req.auth.id })
  .select('role.permissions')
  .getRawMany()
 
  const roles = rolesData.map(item => item.role_permissions).join(',')

  res.json({ ...req.auth, roles })
})

/**
 * 获取所有用户
*/
router.get('/list', async (req, res, next) => {
  const userData = await appDataSource
  .getRepository(AdminUser)
  .createQueryBuilder("u")
  .leftJoinAndSelect(AdminRole, "role", 'find_in_set(role.id, u.role_ids)')
  .select('u.*,group_concat(role.name) as roles')
  .groupBy('u.id')
  .getRawMany()

  res.json({ list: userData })
})

/**
 * 添加用户
 */
router.post('/add', async (req, res, next) => {
  let user = new AdminUser()
  user.user = req.body.user
  user.password = req.body.password
  user.role_ids = req.body.role_ids

  let result = await user.save()
  if (!result || !result.id) throw new AppError('插入失败')
 
  res.json({ message: "插入成功！" })
})

/**
 * 修改用户
 */
router.post('/update', async (req, res, next) => {
  let user = await AdminUser.findOneBy({ id: req.body.id })
  if (!user) throw new AppError('用户不存在')

  user.user = req.body.name
  if (req.body.password) user.password = req.body.password
  user.role_ids = req.body.role_ids

  let result = await user.save()
  if (!result || !result.id) throw new AppError('修改失败')
 
  res.json({ message: "修改成功！" })
})

/**
 * 修改用户
 */
 router.post('/delete', async (req, res, next) => {
  let resulte = await AdminUser.delete({ id: req.body.id })
  if (!resulte || !resulte.affected) throw new AppError('删除失败')
 
  res.json({ message: "删除成功！" })
})

export const adminUser = router