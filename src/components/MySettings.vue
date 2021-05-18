<template>
  <div v-if="showSettings" class="item">
    <h3>Settings</h3>

<!--    <td style="border-style: none"><input type="checkbox" id="checkboxList"></td>-->
<!--    <td style="border-style: none"><label for="checkboxList">Remember selected lists</label><br></td>-->

    <button @click="scrollAndClear" id="btn_clear_data">Clear cached data</button>
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
      console.log('clear clicked');

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