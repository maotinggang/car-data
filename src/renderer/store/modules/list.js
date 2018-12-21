import collection from 'lodash/collection'
const state = {
  list: [],
  selected: {},
  checked: []
}

const mutations = {
  LIST_INIT(state, devices) {
    state.list = devices
  },
  listAdd(state, device) {
    state.list.push(device)
  },
  listDelete(state, id) {
    state.list = collection.reject(state.list, { id: id })
  },
  listUpdate(state, device) {
    state.list = collection.reject(state.list, { id: device.id })
    state.list.push(device)
  },
  deviceSelected(state, device) {
    state.selected = collection.find(state.list, { name: device[0].title })
  },
  deviceChecked(state, devices) {
    state.checked = []
    if (devices[0]) {
      devices = collection.reject(devices, { nodeKey: 0 })
      devices.forEach(element => {
        state.checked.push(
          collection.find(state.list, {
            name: element.title
          })
        )
      })
    }
  }
}

const actions = {
  listInit({ commit }, devices) {
    commit('LIST_INIT', devices)
  },
  getAllList({ state }) {
    return state.list
  },
  deviceSelected(context, device) {
    context.commit('deviceSelected', device)
  },
  deviceChecked(context, devices) {
    context.commit('deviceChecked', devices)
  }
}

export default {
  state,
  mutations,
  actions
}
