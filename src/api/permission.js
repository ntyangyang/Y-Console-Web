import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/sys/permission/all',
    method: 'get'
  })
}

export function saveOrUpdatePerm(params) {
  return request({
    url: '/sys/permission/saveOrUpdate',
    method: 'post',
    data: params
  })
}

export function batchDelPerms(params) {
  return request({
    url: '/sys/permission/batchDelete',
    method: 'post',
    data: params
  })
}

export function getAllByRole(params) {
  return request({
    url: '/sys/permission/allByRole',
    method: 'get',
    params: { roleId: params }
  })
}
