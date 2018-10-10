import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params
  })
}

export function getRoleList() {
  return request({
    url: '/sys/role/all',
    method: 'get'
  })
}

export function getUserRoles(params) {
  return request({
    url: '/sys/user/roles',
    method: 'get',
    params: { id: params }
  })
}

export function delUserByIds(parmas) {
  return request({
    url: '/sys/user/delete',
    method: 'post',
    data: parmas
  })
}

export function saveOrUpdateUser(params) {
  return request({
    url: '/sys/user/saveOrUpdate',
    method: 'post',
    data: params
  })
}

export function acountUpdate(params) {
  return request({
    url: '/sys/user/acountUpdate',
    method: 'post',
    data: params
  })
}

export function passwordUpdate(params) {
  return request({
    url: '/sys/user/passwordUpdate',
    method: 'post',
    data: params
  })
}

export function validateUsername(value, id) {
  return request({
    url: '/sys/user/validateName',
    method: 'get',
    params: { username: value, id: id }
  })
}
