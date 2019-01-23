import { EventBus } from '../../../lib/event'
import { mapActions, mapState } from 'vuex'
import dateTime from 'date-time'
import csvStringify from 'csv-stringify'
import { multiCar, statistics } from '../../../lib/analyze'
import fs from 'fs'
export default {
  data() {
    return {
      formItem: {
        // TODO for test
        id: '渝TT92098',
        datetime: {
          start: '2018-01-01T00:00:00Z',
          end: '2018-02-01T00:00:00Z'
        },
        analyzeId: ''
      },
      analyzeNotice: false,
      analyzeData: ''
    }
  },
  components: {},
  created() {
    EventBus.$on('device-selected', value => {
      this.formItem.id = value
    })
    EventBus.$on('statistics-analyze-notice', (desc, duration) => {
      this.$Notice.info({
        title: '分析车辆数据',
        desc: desc,
        duration: duration
      })
    })
    // 完成分析，显示结果
    EventBus.$on('statistics-analyze-done', value => {
      this.analyzeTableAction(value)
    })
  },
  computed: {
    ...mapState('statistics', ['analyzeTable'])
  },
  methods: {
    ...mapActions('statistics', [
      'analyzeTableAction',
      'analyzeClear',
      'analyzeSpeed',
      'analyzeBorder',
      'analyzeZone'
    ]),
    isSelectCar() {
      if (!this.formItem.id) {
        this.$Message.error({
          content: '请选择车辆',
          duration: 3,
          closable: true
        })
        return false
      }
      return true
    },
    isSelectTime() {
      if (!this.formItem.datetime.start || !this.formItem.datetime.end) {
        this.$Message.error({
          content: '请选择操作时间段',
          duration: 3,
          closable: true
        })
        return false
      }
      return true
    },
    isDisplayTable() {
      if (!this.$store.state.statistics.analyzeTable[0]) {
        this.$Message.error({
          content: '请先加载显示列表',
          duration: 3,
          closable: true
        })
        return false
      }
      return true
    },
    onStatistics() {
      statistics(this.analyzeData)
    },
    onClear() {
      this.analyzeClear()
    },
    onSave() {
      EventBus.$emit('statistics-save', this.analyzeData)
    },
    onSaveAll(file) {
      if (file.path) {
        csvStringify(
          this.analyzeTable,
          {
            header: true,
            columns: [
              { key: 'no', header: '序号' },
              { key: 'id', header: '车牌' },
              { key: 'time', header: '时间' },
              { key: 'alert', header: '告警' },
              { key: 'estimate', header: '准确率' },
              { key: 'speed', header: '速度' },
              { key: 'limit', header: '限速' },
              { key: 'state', header: '状态' },
              { key: 'stano', header: '卫星' },
              { key: 'lng', header: '经度' },
              { key: 'lat', header: '纬度' }
            ]
          },
          (err, data) => {
            if (err) console.log(err)
            else {
              fs.writeFile(file.path, data, err => {
                if (err) console.log(err)
                return false
              })
            }
          }
        )
      }
      return false
    },
    onDisplay() {
      let selectAnalyzeData = {
        id: this.$store.state.list.checked,
        datetime: this.formItem.datetime,
        start: this.formItem.analyzeId,
        type: {
          speed: this.$store.state.statistics.analyzeSpeed,
          border: this.$store.state.statistics.analyzeBorder,
          zone: this.$store.state.statistics.analyzeZone
        }
      }
      this.analyzeTableAction(selectAnalyzeData)
    },
    isCheckedDevice(id) {
      if (!id) {
        this.$Message.error({
          content: '请勾选待分析的车辆',
          duration: 3,
          closable: true
        })
        return false
      }
      return true
    },
    // 分析越界超速
    onAnalyze() {
      if (
        !this.isCheckedDevice(this.$store.state.list.checked[0]) ||
        !this.isSelectTime()
      ) {
        return
      }
      this.formItem.analyzeId = dateTime()
      this.analyzeData = {
        id: this.$store.state.list.checked,
        datetime: this.formItem.datetime,
        start: this.formItem.analyzeId,
        type: {
          speed: this.$store.state.statistics.analyzeSpeed,
          border: this.$store.state.statistics.analyzeBorder,
          zone: this.$store.state.statistics.analyzeZone
        }
      }
      multiCar(this.analyzeData)
    },
    // 选择需要分析的类型
    onSpeed(value) {
      this.analyzeSpeed(value)
    },
    onBorder(value) {
      this.analyzeBorder(value)
    },
    onZone(value) {
      this.analyzeZone(value)
    }
  }
}
