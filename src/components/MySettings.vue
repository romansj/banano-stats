<template>
  <div v-if="showSettings" class="item">
    <h3>Settings</h3>

<!--    <td style="border-style: none"><input type="checkbox" id="checkboxList"></td>-->
<!--    <td style="border-style: none"><label for="checkboxList">Remember selected lists</label><br></td>-->


    <tr>
    <td style="border-style: none"><button @click="scrollAndClear" id="btn_clear_data">Clear cached data</button></td>
    <td style="border-style: none">
      <span>Clear data stored on device</span><br>
      <span style="font-size: small">User ID, username, chosen list (daily/all), payments list, last time data was fetched</span>
    </td>
    </tr>

<!--    <tr>-->
<!--    <td style="border-style: none"><button >View licenses</button></td>-->
<!--    <td style="border-style: none">-->
<!--      <span>Clear data stored on device</span><br>-->
<!--      <span style="font-size: small">User ID, username, chosen list (daily/all), payments list, last time data was fetched</span>-->
<!--    </td>-->
<!--    </tr>-->

<!--    <tr>-->
<!--      <td style="border-style: none"><button >Open FAQ</button></td>-->
<!--      <td style="border-style: none">-->
<!--        <span>View frequently asked questions</span><br>-->
<!--        <span style="font-size: small">User ID, username, chosen list (daily/all), payments list, last time data was fetched</span>-->
<!--      </td>-->
<!--    </tr>-->

<!--    <tr>-->
<!--    <td style="border-style: none"><button >Send a tip</button></td>-->
<!--    <td style="border-style: none">-->
<!--      <span>Clear data stored on device</span><br>-->
<!--      <span style="font-size: small">User ID, username, chosen list (daily/all), payments list, last time data was fetched</span>-->
<!--    </td>-->
<!--    </tr>-->


    <br>

  </div>

</template>

<script>

export default {
  name: "MySettings",

  data:function (){
    return{
      showSettings:true,
    }
  },

  mounted() {

  },

  methods: {
    scrollAndClear: function () {
      this.clearStorage();
      window.scrollTo({top: 0, behavior: 'smooth'});
      setTimeout(() => location.reload(), 700);
    },

    clearStorage: function () {
      localStorage.removeItem("user");
      localStorage.removeItem("user_name");
      localStorage.removeItem("currentList");
      localStorage.removeItem("list");
      localStorage.removeItem("last_fetch");
    }
  }
}


</script>

<style scoped>

</style>