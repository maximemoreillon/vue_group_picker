<template>
  <div id="app">
    <GroupPicker
      class="picker"
      :selectedGroup="selectedGroup"
      @selection="selected($event)"

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
  data(){
    return {
      selectedGroup: null,
    }
  },
  methods: {
    selected({ _id}){
      alert(`You selected group ${_id}`)
      this.selectedGroup = _id
    }
  }
}
</script>

<style scoped>
.picker{
  height: 500px;
}
</style>
