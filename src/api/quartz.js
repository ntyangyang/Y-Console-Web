import request from '@/utils/request'

export function getQuartzList(params) {
  return request({
    url: '/sys/quartz/list',
    method: 'get',
    params
  })
}

export function getQuartzLogList(params) {
  return request({
    url: '/sys/quartz/log/list',
    method: 'get',
    params
  })
}

export function delJobByIds(params) {
  return request({
    url: '/sys/quartz/delete',
    method: 'post',
    data: params
  })
}

export function pauseJobByIds(params) {
  return request({
    url: '/sys/quartz/pause',
    method: 'post',
    data: params
  })
}

export function resumeJobByIds(params) {
  return request({
    url: '/sys/quartz/resume',
    method: 'post',
    data: params
  })
}

export function runByIds(params) {
  return request({
    url: '/sys/quartz/run',
    method: 'post',
    data: params
  })
}

export function saveOrUpdateJob(params) {
  return request({
    url: '/sys/quartz/saveOrUpdate',
    method: 'post',
    data: params
  })
}
