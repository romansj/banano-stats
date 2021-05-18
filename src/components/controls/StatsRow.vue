<template>
  <tr>
    <td width="40%">{{ itemValue }}</td>
    <td width="60%">{{ itemDescription }}</td>
  </tr>

</template>

<script>
export default {
  name: "StatsRow",

  props: {
    itemValue: String,
    itemDescription: String,
  }
}
</script>

<style scoped>

</style>