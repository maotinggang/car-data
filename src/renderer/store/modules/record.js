import array from 'lodash/array'
import collection from 'lodash/collection'
import wgs2bd from '../../../lib/coords'
const state = {
  selectList: [],
  playSpeed: 1,
  display: { track: false, speed: [], zone: [] },
  filter: []
}

const mutations = {
  SELECT_LIST(state, list) {
    state.selectList = []
    state.polylineList = []
    collection.forEach(list, (value, key) => {
      list[key].no = key + 1
      list[key].time = value.time
      if (list[key].state === 'True') {
        list[key].state = '正常'
      } else {
        list[key].state = '未知'
      }
      let coord = wgs2bd(value.lat, value.lng)
      list[key].lat = coord[0]
      list[key].lng = coord[1]
    })
    state.selectList = list
  },
  SELECT_CLEAR(state) {
    state.selectList = []
  },
  PLAY_SPEED(state, value) {
    state.playSpeed = value
  },
  DISPLAY(state, value) {
    state.display = value
  },
  FILTER(state, value) {
    state.filter = value
  }
}

const actions = {
  selectClear({ commit }) {
    commit('SELECT_CLEAR')
  },
  playSpeed({ commit }, value) {
    commit('PLAY_SPEED', value)
  },
  selectList({ commit, state }, list) {
    commit('SELECT_LIST', list)
  },
  display({ commit }, value) {
    let display = { track: false, speed: [], zone: [] }
    if (collection.some(value, '轨迹')) {
      display.track = true
    }
    if (collection.some(value, '限速')) {
      display.speed = [1]
    }
    if (collection.some(value, '边界')) {
      display.zone = [2]
    }
    commit('DISPLAY', display)
  },
  filter({ commit, state }, value) {
    let data = state.selectList
    if (!collection.some(value, '正常')) {
      data = array.dropWhile(data, ['state', '正常'])
    }
    if (!collection.some(value, '超速')) {
      data = array.dropWhile(data, ['state', '超速'])
    }
    if (!collection.some(value, '越界')) {
      data = array.dropWhile(data, ['state', '越界'])
    }
    commit('FILTER', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
