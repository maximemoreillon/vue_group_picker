<template>

  <div class="group_picker">
    <template v-if="!groups_loading">
      <Group
        v-for="group in groups"
        v-bind:group="group"
        v-bind:key="group.identity.low"
        v-bind:apiUrl="apiUrl"
        v-on:selection="$emit('selection',$event)"/>
    </template>

    <!-- wrapper loader so it can be centered in the div -->
    <div class="loader_wrapper" v-else>
      <loader />
    </div>

  </div>

</template>

<script>

import axios from 'axios'
import Group from './Group.vue'
import Loader from '@moreillon/vue_loader'

export default {
  name: 'GroupPicker',
  props: {
    apiUrl: String,
  },
  components: {
    Group,

    Loader
  },
  data(){
    return {
      groups: [],
      groups_loading: false,

    }
  },
  mounted(){
    this.get_highest_hierarchy_groups()
  },
  methods: {
    get_highest_hierarchy_groups(){
      this.groups_loading = true;

      axios.get(`${this.apiUrl}/top_level_groups`, {})
      .then(response => {
        this.groups.splice(0,this.groups.length)
        response.data.forEach((record) => {
          let group = record._fields[record._fieldLookup['group']]
          this.groups.push(group)
        });

      })
      .catch( (error) => { console.log(error) })
      .finally( () => { this.groups_loading = false })
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.group_picker {

  /* share space horizontally */
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;

  height: 100%;
  overflow-y: auto;

  border: 1px solid #dddddd;
}

.loader_wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 200%;
}
</style>
