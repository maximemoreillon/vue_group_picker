<template>
  <div id="app">
    <GroupPicker
      class="picker"
      v-on:selection="selected($event)"
      usersWithNoGroup/>
  </div>
</template>

<script>
import GroupPicker from './GroupPicker.vue'

export default {
  name: 'App',
  components: {
    GroupPicker
  },
  methods: {
    selected(ev){
      console.log(ev)
    }
  }
}
</script>

<style scoped>
.picker{
  height: 500px;
}
</style>
