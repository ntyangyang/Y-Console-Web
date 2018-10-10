import request from '@/utils/request'

export function getLogList(params) {
  return request({
    url: '/sys/log/list',
    method: 'get',
    params
  })
}
