import request from '@/utils/request'

// 登录相关
export function login(username, password) {
  return request({
    url: '/sys/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}

// 用户相关
export function getInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

export function getMenuNav() {
  return request({
    url: '/sys/menu/nav',
    method: 'get'
  })
}
