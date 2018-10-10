import { login, logout, getInfo, getMenuNav } from '@/api/login'
import { getToken, setToken, removeToken, getMenu, setMenu, removeMenu } from '@/utils/auth'
import MenuUtil from '@/utils/MenuUtil'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    asyncRouterMap: getMenu()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ASYNCROUTERMAP: (state, asyncRouterMap) => {
      state.asyncRouterMap = asyncRouterMap
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data)
          commit('SET_TOKEN', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) {
            const a = []
            for (var i = data.roles.length - 1; i >= 0; i--) {
              a.push(data.roles[i].description)
            }
            commit('SET_ROLES', a)
          } else {
            commit('SET_ROLES', [])
          }

          commit('SET_PERMISSIONS', data.permissions)
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取菜单
    GetMenuNav({ commit, state }) {
      return new Promise((resolve, reject) => {
        const temp = []
        getMenuNav().then(response => {
          MenuUtil(temp, response.data)
          setMenu(temp)
          commit('SET_ASYNCROUTERMAP', temp)
          resolve(temp)
        }).catch(error => {
          setMenu(temp)
          commit('SET_ASYNCROUTERMAP', temp)
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ASYNCROUTERMAP', [])
          removeToken()
          removeMenu()
          resolve()
        }).catch(error => {
          console.log(error)
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ASYNCROUTERMAP', [])
          removeToken()
          removeMenu()
          resolve()
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeMenu()
        resolve()
      })
    }
  }
}

export default user
