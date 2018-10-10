import lazyLoading from './lazyLoading'
import Layout from '../views/layout/Layout'

export default (routers, data) => {
  generaMenu(routers, data)
}

function generaMenu(routers, data) {
  for (var i = 0; i <= data.length - 1; i++) {
    if (data[i].type !== 2) {
      const menu = {
        path: data[i].path,
        component: isLayout(data[i].component),
        hidden: isShow(data[i].status),
        children: []
      }

      // 目录
      if (data[i].type === 0) {
        menu['name'] = data[i].name
        menu['meta'] = {}
        menu['meta']['title'] = data[i].name
        menu['meta']['icon'] = data[i].icon
        if (hasChildren(data[i].children)) {
          menu['redirect'] = handleRedirect(data[i].path, data[i].children[0])
          // 处理children
          menu.children = generaChildrenMenu(data[i].path, data[i].children)
        } else {
          menu['redirect'] = data[i].path
        }
      }

      // 菜单
      if (data[i].type === 1) {
        const child = {}
        if (data[i].url && !isIframe(data[i].url)) {
          child['path'] = data[i].url
          child['meta'] = {}
          child['meta']['title'] = data[i].name
          child['meta']['icon'] = data[i].icon
        } else {
          child['path'] = 'index'
          child['name'] = data[i].name
          child['component'] = lazyLoading(data[i].path + '/index')
          child['meta'] = {}
          child['meta']['title'] = data[i].name
          child['meta']['icon'] = data[i].icon
          if (data[i].url) {
            child['meta']['url'] = data[i].url.replace('/iframe-', '')
          }
        }
        menu.children.push(child)
      }
      routers.push(menu)
    }

    const temp = { path: '*', redirect: '/404', hidden: true }
    routers.push(temp)
  }
}

function handleRedirect(str, a) {
  if (a.type === 0 && a.children) {
    return handleRedirect(str + a.path, a.children[0])
  } else if (a.type === 1) {
    return str + a.path
  } else {
    return a.path
  }
}

function generaChildrenMenu(parentPath, data) {
  const children = []
  for (var i = 0; i <= data.length - 1; i++) {
    const menu = {
      path: handleChildPath(data[i].path),
      name: data[i].name,
      component: lazyLoading(data[i].component),
      meta: { title: data[i].name, icon: data[i].icon, url: data[i].url },
      children: []
    }

    if (data[i].type === 0) {
      if (hasChildren(data[i].children)) {
        menu['redirect'] = handleRedirect(parentPath + data[i].path, data[i].children[0])
      } else {
        menu['redirect'] = parentPath + data[i].path
      }
    }

    if (hasChildren(data[i].children)) {
      menu.children = generaChildrenMenu(parentPath + data[i].path, data[i].children)
    }
    children.push(menu)
  }
  return children
}

function isLayout(str) {
  if (str === 'Layout') {
    return Layout
  } else {
    return str
  }
}

function isShow(status) {
  return status === -1
}

function hasChildren(arr) {
  if (Array.isArray(arr) && arr.length > 0) {
    return true
  }
  return false
}

function handleChildPath(str) {
  const a = str
  return a.replace('/', '')
}

function isIframe(str) {
  return str.startsWith('iframe-')
}

