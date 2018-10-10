import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params
  })
}

export function delRoleByIds(parmas) {
  return request({
    url: '/sys/role/delete',
    method: 'post',
    data: parmas
  })
}

export function saveOrUpdateRole(params) {
  return request({
    url: '/sys/role/saveOrUpdate',
    method: 'post',
    data: params
  })
}
