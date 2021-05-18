<template>
  <div class="item">
    <h3>Currency converter</h3>
    <p class="small-text">Exchange rate updated Tuesday May 11 2021</p>

    <form>
      <div class="flex-item">
        <label for="ban_amount">BAN</label>
        <input type="number" v-on:keyup="convert(1)" id="ban_amount">
      </div>

      <div class="flex-item">
        <label for="exchange_rate">Rate</label>
        <input type="number" v-on:keyup="convert(lastConversionFrom)" step="any" id="exchange_rate" :placeholder="exchange_rate">
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

      BAN: 'BAN',
      USD: 'USD',
    }
  },

  methods: {
    getRate: function (from) {
      let exchangeRate = $('#exchange_rate').val();
      if (!exchangeRate) {
        exchangeRate = this.exchange_rate;
        $('#exchange_rate').val(exchangeRate);
      }

      if (from === 2) exchangeRate = 1 / exchangeRate;

      return exchangeRate;
    },

    convert: function (from) {
      let exchangeRate = this.getRate(from);
      let amountFrom = $((from === 1) ? '#ban_amount' : '#usd_amount').val();
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