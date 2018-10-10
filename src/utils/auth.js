import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const MenuKey = 'Admin-Menu'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getMenu() {
  if (sessionStorage.getItem(MenuKey)) {
    return JSON.parse(sessionStorage.getItem(MenuKey))
  } else {
    return []
  }
}

export function setMenu(menu) {
  return sessionStorage.setItem(MenuKey, JSON.stringify(menu))
}

export function removeMenu() {
  return sessionStorage.removeItem(MenuKey)
}
