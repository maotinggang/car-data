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
      <!-- 限速区域 -->
      <bm-polygon
        v-for="(item, index) in displaySpeed"
        :key="index"
        v-if="item"
        :path="item.polygonPath"
        :stroke-color="item.color"
        strokeStyle="dashed"
        :stroke-opacity="0.8"
        :stroke-weight="3"
        :fillColor="item.color"
        :fillOpacity="0.3"
        :dblclick="clickPolygon"
      />
      <!-- 边界区域 -->
      <bm-polygon
        v-for="(item, index) in displayBorder"
        :key="index"
        v-if="item"
        :path="item.polygonPath"
        :stroke-color="item.color"
        :stroke-opacity="0.8"
        :stroke-weight="3"
        :fillColor="item.color"
        :fillOpacity="0.3"
        :dblclick="clickPolygon"
      />
      <!-- 起点 -->
      <bm-marker
        v-if="showTrack"
        :position="startPoint"
        :zIndex=-1
        :icon="iconStart"
      >
      </bm-marker>
      <!-- 终点 -->
      <bm-marker
        v-if="showTrack"
        :position="endPoint"
        :zIndex=-1
        :icon="iconEnd"
      >
      </bm-marker>
      <bm-polyline
        :path="selectList"
        v-if="showPolyline"
        :stroke-opacity="0.8"
        :stroke-weight="5"
      ></bm-polyline>
      <bml-lushu
        v-if="showTrack"
        :path="selectList"
        :icon="iconCar"
        :play="play"
        :speed="playSpeed"
        :rotation="true"
        :autoView="true"
      >
      </bml-lushu>
      <bm-info-window
        :position="{lng: pointInfo.lng, lat: pointInfo.lat}"
        :show="showInfoWindow"
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
import { mapState, mapActions } from "vuex";
import { BmlLushu } from "vue-baidu-map";
export default {
  data() {
    return {
      zoom: 11,
      play: true,
      center: { lng: 116.404, lat: 39.915 },
      pointInfo: "",
      path: [],
      iconCar: {
        url: "../../../../static/img/car.png",
        size: { width: 32, height: 32 },
        opts: { anchor: { width: 13, height: 20 } }
      },
      iconStart: {
        url: "../../../../static/img/start.png",
        size: { width: 48, height: 48 },
        opts: { anchor: { width: 25, height: 38 } }
      },
      iconEnd: {
        url: "../../../../static/img/end.png",
        size: { width: 48, height: 48 },
        opts: { anchor: { width: 25, height: 38 } }
      },
      showInfoWindow: false,
      showTrack: false
    };
  },
  components: {
    BmlLushu
  },
  mounted() {
    EventBus.$on("history-clicked", value => {
      this.center = { lng: value.lng, lat: value.lat };
      this.zoom = 15;
      this.showInfoWindow = true;
      this.pointInfo = value;
    });
    EventBus.$on("history-select-done", () => {
      if (this.selectList[0]) {
        this.center = {
          lng: this.selectList[0].lng,
          lat: this.selectList[0].lat
        };
        this.zoom = 14;
        this.showTrack = true;
      }
    });
    EventBus.$on("history-clear", () => {
      this.showTrack = false;
    });
    EventBus.$on("history-pause", () => {
      this.play = false;
    });
    EventBus.$on("history-play", () => {
      this.play = true;
    });
    EventBus.$on("history-stop", () => {
      this.selectResave(this.selectList);
    });
  },
  methods: {
    ...mapActions("history", ["selectResave"]),
    infoWindowClose() {
      this.show = false;
    },
    infoWindowOpen() {
      this.show = true;
    },
    clickPolygon() {}
  },
  computed: {
    ...mapState("history", [
      "selectList",
      "playSpeed",
      "displayTrack",
      "displaySpeed",
      "displayBorder"
    ]),
    startPoint() {
      let point = this.selectList[0];
      if (point) {
        return point;
      } else {
        return { lng: "", lat: "" };
      }
    },
    endPoint() {
      let point = this.selectList[this.selectList.length - 1];
      if (point) {
        return point;
      } else {
        return { lng: "", lat: "" };
      }
    },
    showPolyline() {
      return this.showTrack && this.displayTrack;
    }
  }
};
</script>

<style scoped>
.bm-view {
  position: fixed;
  width: 100%;
  top: 64px;
  padding-right: 493px;
  bottom: 0;
}
.point-span {
  font-size: 11px;
}
</style>