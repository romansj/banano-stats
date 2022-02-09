<template>
  <div class="item" id="app-2">
    <div v-if="averageWUs!==0 && averagePaymentsPerDay!==0">

      <h3>User stats</h3>

      <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; margin-bottom: 0 !important;">
        <figure>
          <picture draggable="false">
            <source srcset="../assets/banana_dark2.png" media="(prefers-color-scheme: dark)">
            <img style="width: 70px; height: 70px;" class="unselectable" draggable="false" src="../assets/banana.png" alt="Placeholder image">
          </picture>
        </figure>

        <div style="display: flex; flex-direction: column; align-items: start; margin-bottom: 0 !important;">
          <span style="margin-bottom: 5px;" @click="copyText(userID)" class="hover_highlight unselectable">{{ userID }}</span>
          <span style="text-align: start;" @click="copyText(userName)" class="small-text hover_highlight unselectable">{{ userName }}</span>
        </div>
      </div>

      <br>


      <i-o-s13-segmented-control2 :value="rangeIndex2" v-model="rangeIndex2" :element-name="currentItem.text" :segments="ranges"/>

      <br>
      <table>
        <tbody>
        <StatsRow v-for="(stat,index) in allStats" v-bind:key="index" :item-value="stat.value" :item-description="stat.description"/>
        </tbody>
      </table>

      <br>

      <h5>Projected</h5><br>
      <table>
        <tbody>
        <StatsRow :item-value="(averagePaymentsPerDay * 7).toFixed(2)" item-description="BAN per week"/>
        <StatsRow :item-value="(averagePaymentsPerDay * 30).toFixed(2)" item-description="BAN per month"/>
        <StatsRow :item-value="(averagePaymentsPerDay * 365).toFixed(2)" item-description="BAN per year"/>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>
import $ from "jquery";
import IOS13SegmentedControl2 from "./controls/vue-ios13-segmented-control";
import StatsRow from "./controls/StatsRow";

export default {
  name: "BananoStats",
  components: {StatsRow, IOS13SegmentedControl2},
  props: {
    dailyData: Array,
  },

  mounted() {
    //console.log('stats mounted');

    let emitter = require('tiny-emitter/instance');

    //console.log('emitter.currentItem()', emitter.currentItem);

    emitter.on('createImage', () => {
      //console.log('createImage in stats', 'dd length', this.dailyData.length);
      this.calcStats(this.currentItem);

      this.userID = localStorage.getItem("user");
      this.userName = localStorage.getItem('user_name');
    });


    $(function () {

    });

  },

  data() {
    return {
      ranges: [
        {text: 'Past week', intVal: 7, id: 0, title: 'Past week'},
        {text: 'Past 30 days', intVal: 30, id: 1, title: 'Past 30 days'},
        {text: 'All time', intVal: -1, id: 2, title: 'All time'}],

      rangeIndex: 0,

      averagePaymentsPerDay: 0,
      averageWUs: 0,
      averagePoints: 0,

      banPerPoint: 0,
      banPerWu: 0,

      totalAmount: 0,
      totalPoints: 0,

      userID: -1,
      userName: -1,
    }
  },

  computed: {
    allStats: function () {
      let arr = [];
      arr.push({value: this.averagePaymentsPerDay.toFixed(2), description: 'average BAN a day'});
      arr.push({value: this.averageWUs.toFixed(2), description: 'average WUs a day'});
      arr.push({value: this.averagePoints.toFixed(0), description: 'average points a day'});
      arr.push({value: this.banPerPoint.toFixed(10), description: 'average BAN per point'});
      arr.push({value: this.banPerWu.toFixed(10), description: 'average BAN per WU'});
      arr.push({value: this.totalAmount.toFixed(0), description: 'BAN received'});
      arr.push({value: this.totalPoints.toFixed(0), description: 'points gathered'});
      return arr;
    },

    currentIndex: function () {
      return this.rangeIndex;
    },

    currentItem: function () {
      return this.ranges[this.currentIndex];
    },

    rangeIndex2: {
      get() {
        return this.rangeIndex;
      },
      set(newVal) {
        //console.log('settingNewVal in Stats:',newVal);
        this.rangeIndex = newVal;
        this.calcStats(this.currentItem);
      }
    },
  },

  methods: {
    copyText: async function (text) {
      navigator.clipboard.writeText(text).then(function () {
        let emitter = require('tiny-emitter/instance');
        emitter.emit('notify', "🎉 Copied to clipboard!");
      }, function (err) {
        let emitter = require('tiny-emitter/instance');
        emitter.emit('notify', 'Could not copy text: ' + err);
      });

    },

    // changeRange: function (index) {
    //   this.rangeIndex = index;
    //   this.calcStats(this.currentItem);
    // },

    calcStats: function (range) {
      if (this.dailyData.length === 0) return;


      let maxDaysAgo = range.intVal;

      let dataForCalc = [];
      this.dailyData.forEach(function (value) {
        //console.log('fe',value);
        if (maxDaysAgo !== -1) { //if it were -1, then we know that is all data, the full list of payments

          let dateNow = new Date(Date.now());
          let diff = dateNow - new Date(value.created_at);
          let daysDiff = diff / (1000 * 60 * 60 * 24);
          if (daysDiff > maxDaysAgo) return false; //dont want older data than maxDays old
        }

        dataForCalc.push(value);
      });


      this.averagePaymentsPerDay = dataForCalc.reduce((total, next) => total + next.amount, 0) / dataForCalc.length;
      this.averageWUs = dataForCalc.reduce((total, next) => total + next.work_units, 0) / dataForCalc.length;
      this.averagePoints = dataForCalc.reduce((total, next) => total + next.points, 0) / dataForCalc.length;


      let banPerPointList = [];
      dataForCalc.forEach((value) => banPerPointList.push({bpp: value.amount / value.points}));
      this.banPerPoint = banPerPointList.reduce((total, next) => total + next.bpp, 0) / banPerPointList.length;

      let banPerWuList = [];
      dataForCalc.forEach((value) => banPerWuList.push({bpw: value.amount / value.work_units}));
      this.banPerWu = banPerWuList.reduce((total, next) => total + next.bpw, 0) / banPerWuList.length;


      this.totalAmount = dataForCalc.reduce((prev, next) => prev + next.amount, 0);
      this.totalPoints = dataForCalc.reduce((prev, next) => prev + next.points, 0);

      // setTimeout(() => {
      //   this.isLoadingStats = false;
      // }, 600);
    }
  }
}
</script>

<style scoped>
tr td {
  white-space: nowrap;
}


.hover_highlight, .hover_highlight_tag {
  transition: 0.3s;
  cursor: pointer;

  padding: 3px;
}

.hover_highlight:hover {
  background-color: #F3D715;
  color: #212124;
}

.hover_highlight_tag:hover {
  background-color: black !important;
}


.test-parent {
  background-color: deepskyblue;
}

.test-child1 {
  background-color: #4CBF4B;
}

.test-child2 {
  background-color: #0070F3;
}


</style>