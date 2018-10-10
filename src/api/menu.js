import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/sys/menu/all',
    method: 'get'
  })
}

export function getMenuRoles(params) {
  return request({
    url: '/sys/menu/roles',
    method: 'get',
    params: { id: params }
  })
}

export function saveOrUpdateMenu(params) {
  return request({
    url: '/sys/menu/saveOrUpdate',
    method: 'post',
    data: params
  })
}

export function batchDelMenus(params) {
  return request({
    url: '/sys/menu/batchDelete',
    method: 'post',
    data: params
  })
}

