import collection from 'lodash/collection'
const state = {
  list: [],
  selected: '',
  checked: ['渝A0G801'], // TODO for test
  selectList: []
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
  }
}

const actions = {
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
