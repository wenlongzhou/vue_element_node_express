import * as express from "express"
import { AppError } from "../../exceptions/appError"
import { AdminRole } from "../../entity/adminRole"
let router = express.Router()

/**
 * 获取所有角色
*/
router.get('/list', async (req, res, next) => {
  let rolesData = await AdminRole.find()

  rolesData = rolesData.map(item => {
    item.routes = item.permissions.split(',')
    delete item.permissions
    return item
  })
 
  res.json({ list: rolesData })
})

/**
 * 添加角色
 */
router.post('/add', async (req, res, next) => {
  let role = new AdminRole()
  role.name = req.body.name
  role.remark = req.body.remark
  role.permissions = req.body.routes

  let result = await role.save()
  if (!result || !result.id) throw new AppError('插入失败')
 
  res.json({ message: "插入成功！" })
})

/**
 * 修改角色
 */
router.post('/update', async (req, res, next) => {
  let role = await AdminRole.findOneBy({ id: req.body.id })
  if (!role) throw new AppError('角色不存在')

  role.name = req.body.name
  role.permissions = req.body.routes
  role.remark = req.body.remark

  let result = await role.save()
  if (!result || !result.id) throw new AppError('修改失败')
 
  res.json({ message: "修改成功！" })
})

/**
 * 修改角色
 */
 router.post('/delete', async (req, res, next) => {
  let resulte = await AdminRole.delete({ id: req.body.id })
  if (!resulte || !resulte.affected) throw new AppError('删除失败')
 
  res.json({ message: "删除成功！" })
})

export const adminRole = router