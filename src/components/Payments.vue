<template>
  <div class="item">
    <input placeholder="User ID" type="text" id="input_id" required>
    <button :class="{'is-loading': isLoadingStats,'shake': badInput  }" @click="fetchBananoUserStats" id="btn_submit">Submit</button>
    <br>
    <span class="small-text" v-if="fetchDate!==''">Last updated: {{ fetchDate }}</span>

    <div v-if="dailyData.length!==0 && todos.length!==0">
      <br>
      <h3>Payments</h3>
      <button style="width: 100px;" class="outlined-button" @click="switchList">{{ currentList2 === 0 ? "Daily" : "All" }}</button>
      <br>

      <!-- Can't use a second instance because clicking one affects the other for whatever mystical weird reason -->
      <!--    <i-o-s13-segmented-control id="seg_pay" :value="currentList2" v-model="currentList2" :element-name="currentList2.title" :segments="timeLists"/>-->

      <br>

      <div class="table-container">
        <table>
          <thead>
          <tr>
            <th>BAN</th>
            <th>Points</th>
            <th>WUs</th>
            <th>Date</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="todo in (currentList2  ===0) ? dailyData: todos" :key="todo.key">
            <td width="20%">{{ todo.amount.toFixed(2) }}</td>
            <td width="30%">{{ todo.points }}</td>
            <td width="15%">{{ todo.work_units }}</td>
            <td width="35%">{{ todo.created_at }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Passing generated dailyData for statistics generation -->
    <!--    <BananoStats :daily-data="dailyData"/>-->
  </div>

</template>


<script>
import $ from "jquery";
// import BananoStats from "./BananoStats";
// import IOS13SegmentedControl from "./vue-ios13-segmented-control";


export default {
  name: "Payments",
  components: {
    // BananoStats,
    // IOS13SegmentedControl
  },

  mounted() {
    let inputField = $('#input_id');
    inputField.on('keypress', function (e) {
      let key = e.which;
      if (key === 13) this.fetchBananoUserStats();
    });
    $("#btn_submit").on('click', () => this.fetchBananoUserStats());


    let storedUserID = localStorage.getItem("user");
    inputField.val(storedUserID);
    if (storedUserID) {
      //console.log('storedID not null ' + storedUserID);
      this.fetchBananoUserStats();
    }


    // let savedList = localStorage.getItem("currentList");
    // this.timeListIndex = savedList ? savedList : this.DAILY;
  },

  data() {
    return {
      timeLists: [{id: 0, title: 'DAILY'}, {id: 1, title: 'ALL'}],

      timeListIndex: 0,
      todos: [],
      dailyData: [],
      isLoadingStats: false,
      badInput: false,
      fetchDate: '',
      userID: -1,
      userName: '',
    }
  },

  methods: {
    notify: function (text, duration) {
      let emitter = require('tiny-emitter/instance');
      emitter.emit('notify', text, duration);
    },


    switchList: function () {
      this.timeListIndex = this.timeListIndex === 0 ? 1 : 0;
      localStorage.setItem("currentList", this.timeListIndex);
    },


    fetchBananoUserStats: function () {
      let userID = $('#input_id').val();
      if (!userID) {
        this.badInput = true;
        setTimeout(() => this.badInput = false, 500);
        this.notify("Please enter your user ID");
        return;
      }


      let url = 'https://bananominer.com/user_name/' + userID;
      this.userID = userID;

      let storedUserID = localStorage.getItem("user");
      this.userName = localStorage.getItem('user_name');


      if (storedUserID === userID) {
        let tooSoon = this.checkFetchingTooSoon();
        if (tooSoon) {

          this.createDailyList();
          //console.log('tooSoon yes', 'dd length', this.dailyData.length);

          this.calcStats();

          return; //fetching too soon, user has to wait a bit
        }

      } else {
        //fetching info for different user than before
        //no need to check time diff then
      }


      fetch(url)
          .then(res => res.json())
          .then((out) => {
            if (out.error != null) {
              alert(out.error)
              return;
            }

            let reversedList = out.payments.reverse();

            let previousScore = 0;
            let previousWUs = 0;
            let todos = this.todos;
            todos.splice(0); //clear existing data before adding new
            $.each(reversedList, function (key, val) {
              let score = val.score - previousScore;
              let wus = val.work_units - previousWUs;

              //console.log('val.amount ' + val.amount + ', score ' + score + ', wus ' + wus);

              todos.push({
                amount: val.amount,
                points: score,
                work_units: wus,
                created_at: new Date(val.created_at).toISOString().slice(0, 10)
              })

              previousScore = val.score;
              previousWUs = val.work_units;
            });


            this.todos = todos.reverse();


            this.createDailyList();
            this.calcStats();


            this.userName = out.user.name.toString();


            let date = new Date(Date.now());
            this.fetchDate = date.toDateString() + ' ' + date.toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});

            localStorage.setItem("last_fetch", date);
            localStorage.setItem("list", JSON.stringify(todos));
            localStorage.setItem("user", userID.toString());
            localStorage.setItem("user_name", out.user.name.toString());


            this.notify("Updated 🍌!");


          }).catch(err => console.log(err));
    },


    checkFetchingTooSoon: function () {
      var fetchTime = localStorage.getItem("last_fetch");
      if (!fetchTime) fetchTime = "01.01.1970 00:01"
      let fetchDate = new Date(fetchTime);
      var timeNow = Date.now();


      var diff = timeNow - fetchDate;
      var diffMinutes = diff / 60000;
      console.log("diffMins " + diffMinutes)

      //dont fetch too often!
      this.isLoadingStats = true; //to change button to loading
      if (diffMinutes < 2 && diffMinutes !== 0) {
        this.fetchDate = fetchDate.toDateString() + ' ' + fetchDate.toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});

        this.todos = JSON.parse(localStorage.getItem("list"));
        this.notify("Please wait a few minutes before making a new request. Restored list from cache", 8000);


        return true;
      }

      return false;
    },


    createDailyList: function () {
      let myList = this.todos;
      let myMap = new Map();

      $.each(myList, function (key, val) {
        let createdAt = new Date(val.created_at);

        let myDate = new Date(createdAt.setHours(0, 0, 0, 0)); //remove time
        let dateKey = myDate.toString();
        if (myMap.has(dateKey)) {

          let existingItem = myMap.get(dateKey);
          let myNewVal = {amount: val.amount, work_units: val.work_units, points: val.points, created_at: val.created_at};

          let prevAmount = existingItem.amount;
          myNewVal.amount += prevAmount;

          let prevWU = existingItem.work_units;
          myNewVal.work_units += prevWU;

          let prevPoints = existingItem.points;
          myNewVal.points += prevPoints;


          myMap.set(dateKey, myNewVal);

        } else {
          myMap.set(dateKey, val);
        }

      });


      let dailyData = this.dailyData;
      dailyData.splice(0);
      myMap.forEach(function (value) {
        dailyData.push({
          amount: value.amount,
          points: value.points,
          work_units: value.work_units,
          created_at: value.created_at,
        });
      });
    },

    calcStats: function () {
      setTimeout(()=>{
        let emitter = require('tiny-emitter/instance');
        emitter.emit('createImage');
      },500);

    },


  },

  computed: {
    currentIndex: function () {
      return this.timeListIndex;
    },
    currentList: function () {
      return this.timeLists[this.currentIndex];
    },

    currentList2: {
      get() {
        return this.timeListIndex;
      },
      set(newVal) {
        //if (origin !== 'pay') return;
        //console.log('settingNewVal in Payments:', newVal)
        this.timeListIndex = newVal;
        localStorage.setItem("currentList", this.timeListIndex);
      }
    }
  }
}


</script>


<style>
/*td{*/
/*  width: 25% !important;*/
/*}*/

.table-container {
  max-height: 600px;
  overflow-y: auto;
}


</style>