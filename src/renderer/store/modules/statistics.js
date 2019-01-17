import collection from 'lodash/collection'
import array from 'lodash/array'
import { wgs2bd } from '../../../lib/coords'
import { asyncSelectAllAnalyze } from '../../../lib/maria'
const state = {
  analyzeTable: [],
  analyze100Table: [],
  analyzeSpeed: true,
  analyzeBorder: false,
  analyzeZone: false
}

const mutations = {
  ANALYZE_TABLE_ACTION(state, value) {
    state.analyzeTable = []
    state.analyzeTable = value
  },
  ANALYZE_TABLE100_ACTION(state, value) {
    state.analyze100Table = []
    state.analyze100Table = value
  },
  ANALYZE_CLEAR(state) {
    state.analyzeTable = []
    state.analyze100Table = []
  },
  ANALYZE_SPEED(state, value) {
    state.analyzeSpeed = value
  },
  ANALYZE_BORDER(state, value) {
    state.analyzeBorder = value
  },
  ANALYZE_ZONE(state, value) {
    state.analyzeZone = value
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
          if (value.estimate) result[key].estimate = value.estimate + '%'
          if (value.state === 'True') {
            result[key].state = '定位'
          } else {
            result[key].state = '不定位'
          }
        })
        commit('ANALYZE_TABLE100_ACTION', array.slice(result, 0, 100))
        commit('ANALYZE_TABLE_ACTION', result)
      })
      .catch(err => {
        console.log(err)
      })
  },
  analyzeTable100Action({ state, commit }, value) {
    commit(
      'ANALYZE_TABLE100_ACTION',
      array.slice(state.analyzeTable, (value - 1) * 100, value * 100)
    )
  },
  analyzeSpeed({ commit }, value) {
    commit('ANALYZE_SPEED', value)
  },
  analyzeBorder({ commit }, value) {
    commit('ANALYZE_BORDER', value)
  },
  analyzeZone({ commit }, value) {
    commit('ANALYZE_ZONE', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
