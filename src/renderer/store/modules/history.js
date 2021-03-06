import collection from 'lodash/collection'
import { wgs2bd } from '../../../lib/coords'
const state = {
  selectList: [],
  playSpeed: 1000,
  displayTrack: true,
  displaySpeed: [],
  displayBorder: []
}

const mutations = {
  SELECT_LIST_ACTION(state, list) {
    state.selectList = []
    collection.forEach(list, (value, key) => {
      list[key].no = key + 1
      list[key].time = value.time
      if (list[key].state === 'True') {
        list[key].state = '定位'
      } else {
        list[key].state = '不定位'
      }
      let coord = wgs2bd(value.lat, value.lng)
      list[key].lat = coord[0]
      list[key].lng = coord[1]
    })
    state.selectList = list
  },
  SELECT_RESAVE(state, list) {
    state.selectList = list
  },
  SELECT_CLEAR(state) {
    state.selectList = []
  },
  PLAY_SPEED(state, value) {
    state.playSpeed = value
  },
  DISPLAY_TRACK(state, value) {
    state.displayTrack = value
  },
  DISPLAY_SPEED(state, value) {
    state.displaySpeed = value
  },
  DISPLAY_BORDER(state, value) {
    state.displayBorder = value
  }
}

const actions = {
  selectClear({ commit }) {
    commit('SELECT_CLEAR')
  },
  playSpeed({ commit }, value) {
    commit('PLAY_SPEED', value * 1000)
  },
  selectListAction({ commit }, list) {
    commit('SELECT_LIST_ACTION', list)
  },
  selectResave({ commit }, list) {
    commit('SELECT_CLEAR')
    setTimeout(() => {
      commit('SELECT_RESAVE', list)
    }, 100)
  },
  displayTrack({ commit }, value) {
    commit('DISPLAY_TRACK', value)
  },
  displaySpeed({ commit }, value) {
    commit('DISPLAY_SPEED', value)
  },
  displayBorder({ commit }, value) {
    commit('DISPLAY_BORDER', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
