<template>
  <div class="item">
    <h3>Currency converter</h3>
    <p class="small-text">Exchange rate updated {{ lastUpdateDate }}</p>


    <form>
      <div class="flex-item">
        <label for="ban_amount">BAN</label>
        <input type="number" v-on:keyup="convert(1)" id="ban_amount">
      </div>

      <div class="flex-item">
        <label for="exchange_rate">Rate</label>
        <input type="number" v-on:keyup="convert(lastConversionFrom)" step="any" id="exchange_rate" :placeholder="exchange_rate">
        <a> <span style="padding: 5px; cursor: pointer;" @click="updateRate" class="material-icons">refresh</span></a>
      </div>

      <div class="flex-item">
        <label for="usd_amount">USD</label>
        <input type="number" v-on:keyup="convert(2)" id="usd_amount">
      </div>

    </form>

  </div>
</template>

<script>
import $ from "jquery";


export default {
  name: "CurrencyConverter",


  data: function () {
    return {
      exchange_rate: 0.04826,
      lastConversionFrom: 1,
      lastUpdateDate: this.getDateTimeStringFromStr('2021-05-23 23:45'),

      BAN: 'BAN',
      USD: 'USD',
    }
  },

  methods: {
    updateRate: function () {
      //http://localhost:3000
      //https://banano-stats.ue.r.appspot.com

      fetch('https://banano-stats.ue.r.appspot.com')
          .then(res => res.json())
          .then((jsonFile) => {
            // Initialize the DOM parser
            //var parser = new DOMParser();

            // Parse the text
            //var doc = parser.parseFromString(data, "text/html");

            // You can now even select part of that html as you would in the regular DOM
            // Example:
            // var docArticle = doc.querySelector('article').innerHTML;
            //doc.querySelector(".priceValue___11gHJ").innerHTML;
            console.log(jsonFile);

            //let jsonData = JSON.parse(jsonFile);


            this.exchange_rate = jsonFile.data[4704].quote['USD'].price;
            console.log('exchange_rate', this.exchange_rate);

            this.lastUpdateDate = this.getDateTimeStringFromStr(jsonFile.status.timestamp);
            console.log('lastUpdateDate', this.lastUpdateDate);


            $('#exchange_rate').val('');
            this.convert(this.lastConversionFrom);


          })
          .catch(function (err) {
            console.log('Failed to fetch page: ', err);
          });
    },


    getDateTimeStringFromDate: function (date) {
      let dateTimeStr = date.toDateString() + ' ' + date.toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});
      return dateTimeStr;
    },

    getDateTimeStringFromStr: function (stringVal) {
      return this.getDateTimeStringFromDate(new Date(stringVal));
    },


    getRate: function (from) {
      let exchangeRate = $('#exchange_rate').val();
      if (!exchangeRate) {
        exchangeRate = this.exchange_rate;
        $('#exchange_rate').val(exchangeRate);
      }

      if (from === 2) {
        if (exchangeRate == 0) return 0;

        exchangeRate = 1 / exchangeRate;
      }

      return exchangeRate;
    },

    convert: function (from) {
      let amountFrom = $((from === 1) ? '#ban_amount' : '#usd_amount').val();
      let exchangeRate = this.getRate(from);

      if (amountFrom > 999999999999 || exchangeRate > 999999999999) {
        this.notify('Amount entered cannot be more than 999 999 999 999');
        return;
      }

      let conversionResult = amountFrom * exchangeRate;
      //console.log('amountBAN ' + amountFrom + ', exchangeRate ' + exchangeRate + ', conversionResult ' + conversionResult);

      $((from === 2) ? '#ban_amount' : '#usd_amount').val(conversionResult.toFixed(2));

      this.lastConversionFrom = from;
    },


    setConversionInputListeners: function () {
      let zezis = this; //"Potentially invalid usage of this "

      let inputField = $('#ban_amount');
      inputField.on('keypress', function (e) {
        let key = e.which;
        if (key === 13) zezis.convert(zezis.BAN);
      });

      let inputUSD = $('#usd_amount');
      inputUSD.on('keypress', function (e) {
        let key = e.which;
        if (key === 13) zezis.convert(zezis.USD);
      });

      let inputExchangeRate = $('#exchange_rate');
      inputExchangeRate.on('keypress', function (e) {
        let key = e.which;
        if (key === 13) zezis.convert(zezis.lastConversionFrom ? zezis.lastConversionFrom : zezis.BAN);
      });

      inputField.on('paste', () => this.convert(this.BAN));
      inputUSD.on('paste', () => this.convert(this.USD));
      inputExchangeRate.on('paste, keyup', () => this.convert(this.lastConversionFrom ? this.lastConversionFrom : this.BAN));

    },

    notify: function (text, duration) {
      let emitter = require('tiny-emitter/instance');
      emitter.emit('notify', text, duration);
    },

    mounted() {
      $(function () {
        this.setConversionInputListeners();
      })
    },

  },
}
</script>

<style scoped>
form {
  padding-left: 10px;
  padding-right: 10px;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
}

.flex-item {
  display: flex;
  align-items: center;
  margin: 5px;
}

form label {
  padding-right: 10px;
}

form input {
  margin-bottom: 0 !important;
}
</style>