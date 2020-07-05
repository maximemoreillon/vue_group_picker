<template>
  <div id="app">
    <GroupPicker
      class="picker"
      v-on:selection="selected($event)"
      apiUrl="http://172.16.98.151:31999"
      groupPageUrl="http://172.16.98.151:31097/group"
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
  height: 200px;
}
</style>
