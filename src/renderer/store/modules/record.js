import collection from 'lodash/collection'
const state = {
  selectList: [],
  playSpeed: 1
}

const mutations = {
  SELECT_LIST(state, list) {
    state.selectList = []
    collection.forEach(list, (value, key) => {
      list[key].no = key + 1
      list[key].time = value.time
      if (list[key].state === 'True') {
        list[key].state = '正常'
      } else {
        list[key].state = '未知'
      }
    })
    state.selectList = list
  },
  SELECT_CLEAR(state) {
    state.selectList = []
  },
  PLAY_SPEED(state, value) {
    state.playSpeed = value
  }
}

const actions = {
  selectClear({ commit }) {
    commit('SELECT_CLEAR')
  },
  playSpeed({ commit }) {
    commit('PLAY_SPEED')
  },
  selectList({ commit }, list) {
    commit('SELECT_LIST', list)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
