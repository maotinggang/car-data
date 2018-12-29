import collection from 'lodash/collection'
const state = {
  list: [],
  selected: '',
  checked: ['渝TT92098'], // TODO for test
  selectList: [],
  windowHeight: window.innerHeight
}

const mutations = {
  LIST_INIT(state, devices) {
    state.list = devices
  },
  listDelete(state, id) {
    state.list = collection.reject(state.list, { id: id })
  },
  listUpdate(state, device) {
    state.list = collection.reject(state.list, { id: device.id })
    state.list.push(device)
  },
  DEVICE_SELECTED(state, device) {
    state.selected = ''
    state.selected = device
  },
  DEVICE_CHECKED(state, devices) {
    state.checked = []
    state.checked = devices
  },
  WINDOW_HEIGHT(state, value) {
    state.windowHeight = value
  }
}

const actions = {
  getWindowHeight({ commit }, value) {
    commit('WINDOW_HEIGHT', value)
  },
  listInit({ commit }, devices) {
    commit('LIST_INIT', devices)
  },
  deviceSelected({ commit }, device) {
    commit('DEVICE_SELECTED', device)
  },
  deviceChecked({ commit }, devices) {
    commit('DEVICE_CHECKED', devices)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
