import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/adminUser/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/adminUser/userInfo',
    method: 'get'
  })
}

export function getCaptcha(data) {
  return request({
    url: '/adminUser/captcha',
    method: 'get',
    data
  })
}

export function userList() {
  return request({
    url: '/adminUser/list',
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/adminUser/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: `/adminUser/update`,
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: `/adminUser/delete`,
    method: 'post',
    data
  })
}
