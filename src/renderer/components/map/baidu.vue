<template>
  <div>
    <baidu-map
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      :continuous-zoom="true"
    >
      <bm-map-type
        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
        anchor="BMAP_ANCHOR_TOP_LEFT"
      ></bm-map-type>
      <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
      ></bm-geolocation>
      <bm-polyline
        v-if="showLine"
        :path="selectList"
        stroke-color="red"
        :stroke-opacity="1"
        :stroke-weight="4"
      ></bm-polyline>
      <bm-polyline
        :path="polylinePlay"
        v-if="showPlay"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="3"
      ></bm-polyline>
      <bm-info-window
        :position="{lng: pointInfo.lng, lat: pointInfo.lat}"
        :show="show"
        @close="infoWindowClose"
        @open="infoWindowOpen"
        :title="'车牌：'+pointInfo.id"
        :offset="{width:3,height:-3}"
      ><span class="point-span">
          <Row>
            <Col span="18">
            时间：{{pointInfo.time}}
            </Col>
            <Col span="6">
            状态：{{pointInfo.state}}
            </Col>
          </Row>
          <Row>
            <Col span="12">
            经度：{{pointInfo.lng}}
            </Col>
            <Col span="12">
            纬度：{{pointInfo.lat}}
            </Col>
          </Row>
          <Row>
            <Col span="8">
            方向：{{pointInfo.direction}}
            </Col>
            <Col span="8">
            速度：{{pointInfo.speed}}
            </Col>
            <Col span="8">
            卫星：{{pointInfo.stano}}
            </Col>
          </Row>
        </span>
      </bm-info-window>
    </baidu-map>
  </div>
</template>

<script>
import { EventBus } from "../../../lib/event";
import { mapState } from "vuex";
export default {
  data() {
    return {
      center: { lng: 116.404, lat: 39.915 },
      zoom: 15,
      show: false,
      pointInfo: "",
      polyStartEnd: { start: "", end: "" },
      showLine: false,
      showPlay: false,
      polylinePlay: [],
      play: "",
      index: 0
    };
  },
  mounted() {
    EventBus.$on("record-clicked", value => {
      this.center = { lng: value.lng, lat: value.lat };
      this.zoom = 19;
      this.show = true;
      this.pointInfo = value;
    });
    EventBus.$on("record-select-done", () => {
      this.index = 0;
      if (this.selectList[0]) {
        this.showLine = true;
        this.center = {
          lng: this.selectList[0].lng,
          lat: this.selectList[0].lat
        };
        this.zoom = 14;
      }
    });
    EventBus.$on("record-clear", () => {
      this.index = 0;
      this.polylinePlay = [];
      clearInterval(this.play);
    });
    EventBus.$on("record-pause", () => {
      clearInterval(this.play);
    });

    EventBus.$on("record-play", () => {
      this.showPlay = true;
      let count = this.selectList.length;
      this.polylinePlay = [];
      this.play = setInterval(
        () => {
          if (this.index < count) {
            for (let i = 0; i < this.playSpeed; i++) {
              if (this.selectList[this.index]) {
                this.polylinePlay.push({
                  lng: this.selectList[this.index].lng,
                  lat: this.selectList[this.index].lat
                });
                this.index++;
              } else {
                this.index = 0;
                break;
              }
            }
          } else {
            clearInterval(this.play);
          }
        },
        500,
        count
      );
    });
  },
  methods: {
    infoWindowClose() {
      this.show = false;
    },
    infoWindowOpen() {
      this.show = true;
    }
  },
  computed: {
    ...mapState("record", ["selectList", "playSpeed"])
  }
};
</script>

<style scoped>
.bm-view {
  position: fixed;
  width: 100%;
  top: 200px;
  padding-right: 500px;
  bottom: 0;
}
.point-span {
  font-size: 11px;
  color: sienna;
}
</style>