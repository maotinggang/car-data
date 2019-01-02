import collection from 'lodash/collection'
import { wgs2bd } from '../../../lib/coords'
import { asyncSelectAllAnalyze } from '../../../lib/maria'
const state = {
  analyzeTable: [],
  analyzeSpeed: true,
  analyzeBorder: false
}

const mutations = {
  ANALYZE_TABLE_ACTION(state, value) {
    state.analyzeTable = []
    state.analyzeTable = value
  },
  ANALYZE_CLEAR(state) {
    state.analyzeTable = []
  },
  ANALYZE_SPEED(state, value) {
    state.analyzeSpeed = value
  },
  ANALYZE_BORDER(state, value) {
    state.analyzeBorder = value
  }
}

const actions = {
  analyzeClear({ commit }) {
    commit('ANALYZE_CLEAR')
  },
  analyzeTableAction({ commit }, value) {
    asyncSelectAllAnalyze(value.start)
      .then(result => {
        collection.forEach(result, (value, key) => {
          result[key].no = key + 1
          let coord = wgs2bd(value.lat, value.lng)
          result[key].lat = coord[0]
          result[key].lng = coord[1]
        })
        commit('ANALYZE_TABLE_ACTION', result)
      })
      .catch(err => {
        console.log(err)
      })
  },
  analyzeSpeed({ commit }, value) {
    commit('ANALYZE_SPEED', value)
  },
  analyzeBorder({ commit }, value) {
    commit('ANALYZE_BORDER', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
