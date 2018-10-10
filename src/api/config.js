import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sys/config/list',
    method: 'get',
    params
  })
}

export function delParamByIds(parmas) {
  return request({
    url: '/sys/config/delete',
    method: 'post',
    data: parmas
  })
}

export function saveOrUpdateParam(params) {
  return request({
    url: '/sys/config/saveOrUpdate',
    method: 'post',
    data: params
  })
}
