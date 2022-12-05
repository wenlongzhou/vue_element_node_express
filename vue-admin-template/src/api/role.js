import request from '@/utils/request'

export function roleList() {
  return request({
    url: '/adminRole/list',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/adminRole/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/adminRole/update`,
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: `/adminRole/delete`,
    method: 'post',
    data
  })
}
