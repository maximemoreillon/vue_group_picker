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
    selected(group){
      if(!group) alert(`You selected no group`)
      const {name, _id} = group
      alert(`You selected group ${name} (ID ${_id})`)
    }
  }
}
</script>

<style scoped>
.picker{
  height: 500px;
}
</style>
