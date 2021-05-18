<template>

  <!--  https://developer.mozilla.org/en-US/docs/Web/CSS-->

  <!--
  $display by day - sum payments and points of one day into one variable in one object
  $calculate average per day/ month/ year based on above data
  $calculate other metrics like in Excel - $WU, points per WU, BAN per WU, $BAN per point, _USD

  $pull data from https://bananominer.com/user_name/djlgnpisyey3 <pre> element value
  $allow replacing user_name

  https://creeper.banano.cc/explorer/account/ban_3rgxdhejtjnneoharwb9rkpkgn1t9kfopqopg9txt8bqttkkcejb4meyismy/history


  what can I do better than this? Or do something that they dont? $Performance
  https://www.monkey2monkey.com/fh-stats/
  -->


  <div class="container">
    <MyNotification/>

    <Payments id="payments" ref="payments"/>
    <BananoStats id="stats" :daily-data="dailyData"/>
    <CurrencyConverter/>
    <MySettings id="settings"/>

  </div>

</template>

<script>

import Payments from "./components/Payments";
import MyNotification from "./components/controls/MyNotification";
import MySettings from "./components/MySettings";
import BananoStats from "./components/BananoStats";
import CurrencyConverter from "./components/CurrencyConverter";


export default {
  name: 'App',
  components: {
    BananoStats,
    MySettings,
    Payments,
    MyNotification,
    CurrencyConverter
  },

  mounted: function () {
    this.dailyData = this.$refs.payments.$data.dailyData
  },

  data: function () {
    return {
      dailyData: [],
    };
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@exampledev/new.css@1/new.min.css');

:root {
  --color-scheme: light;

  --green: #4CBF4B;
  --main-bg-color: var(--green);
  --icon-color: #1c1c1c;
  --text-color: #1c1c1c;
  --nc-font-sans: 'Inter', sans-serif;
  --yelow: #FBDD11;


  /*
  --nc-lk-1: Action color for links and buttons
  --nc-lk-2: Link and buttons on mouse hover and active
  --nc-lk-tx: Text color for link buttons, or cases where link color is used as a background
  --nc-ac-1: Accent background color for <mark> and text selection background
  */
  --nc-lk-1: var(--green);
  --nc-lk-2: var(--green);
  --nc-lk-tx: black;
  --nc-ac-1: var(--green);
}


@media (prefers-color-scheme: dark) {
  :root {
    --main-bg-color: #1c1c1c;
    --icon-color: #f5f5f5;
    --text-color: #f5f5f5;

    --nc-lk-1: var(--green);
    --nc-lk-2: var(--green);
    --nc-lk-tx: black;
    --nc-ac-1: #767676;


    --color-scheme: dark;
  }
}


.container {
  /*background-color: #767676;*/
  margin-bottom: 20px;
  margin-top: 20px;
  justify-content: center;
  /*display: flex; !* or inline-flex *!*/
  /*flex-direction: row;*/
  /*flex-wrap: wrap;*/

}

.item {
  /*background-color: blueviolet;*/
  margin-bottom: 20px;
  min-width: 300px;
  flex-grow: 1;
}


body {
  /*background-color: var(--main-bg-color);*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  padding: 1rem !important;

  /*padding-bottom: 90px;*/
}

h1, footer {
  text-align: center;
}


.sidenav {
  height: 70px; /* Full-height: remove this if you want "auto" height */
  width: 100%; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  bottom: 0; /* Stay at the top */
  left: 0;
  background-color: #1c1c1c; /* Black */
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 20px;
  justify-content: center;
  display: flex;
}

.sidenav a {
  margin: 10px;
}


#app {
  text-align: center;
  margin-top: 60px;
}



button {
  -webkit-transition: all .2s ease;
  transition: all .2s ease;

  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

button:hover {
  opacity: .5;
}

button:focus {
  opacity: .5;
}

button:active {
  transform: scale(.95);
  opacity: .5;
}


button:not(:hover) {
  transform: scale(1);
  opacity: 1;
}

.outlined-button {
  /*inside border using box shadow*/
  -webkit-box-shadow: inset 0px 0px 0px 2px var(--green);
  -moz-box-shadow: inset 0px 0px 0px 2px var(--green);
  box-shadow: inset 0px 0px 0px 2px var(--green);

  /*outlined, not filled like regular <button>, !important to prevent button overriding background color */
  background-color: transparent !important;
  border-radius: 10px;
}

a {
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

a:hover {
  transform: scale(.95);
  opacity: .5;
}

input {
  -webkit-transition: 0.2s;
  transition: 0.2s;
}

input:hover {
  border-color: rgba(66, 66, 66, 0.8);
}

input:focus {
  outline: none;
  border-color: var(--green);
}


/*autofill remove background color - especially useful in dark theme*/
/*Unfortunately on mobile Chrome text color goes dark after autofill regardless of what settings I use*/
/*input:-webkit-autofill {*/
/*  color: #eeeeee !important;*/
/*  -webkit-background-clip: text !important;*/
/*}*/
/*input:-webkit-autofill:active {*/
/*  color: #eeeeee !important;*/
/*  -webkit-background-clip: text !important;*/
/*}*/
/*input:-webkit-autofill:hover {*/
/*  color: #eeeeee !important;*/
/*  -webkit-background-clip: text !important;*/
/*}*/
/*input:-webkit-autofill:focus {*/
/*  color: #eeeeee !important;*/
/*  -webkit-background-clip: text !important;*/
/*}*/

.small-text {
  font-size: smaller;
}

/*Remove arrows in input field*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}


.unselectable {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
                                   supported by Chrome, Edge, Opera and Firefox */

  -webkit-tap-highlight-color: transparent;
}

</style>
