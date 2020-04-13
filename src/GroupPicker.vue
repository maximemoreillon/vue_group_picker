<template>

  <div class="group_picker">

    <div
      v-if="usersWithNoGroup"
      class="users_with_no_group"
      v-on:click="$emit('selection', null)">
      Users with no group
    </div>

    <!-- Bookmarked groups -->
    <template
      v-if="!official_groups_loading && official_groups.length > 0">
      <div class="category_title">Official groups</div>
      <Group
        v-for="group in official_groups"
        v-bind:group="group"
        v-bind:key="`official_group_${group.identity.low}`"
        v-bind:apiUrl="apiUrl"
        v-bind:groupPageUrl="groupPageUrl"
        v-on:selection="$emit('selection',$event)"
        v-bind:groupsOfUser="groups_of_user"/>

    </template>
    <loader v-if="official_groups_loading"/>

    <template
      v-if="!non_official_groups_loading && non_official_groups.length > 0">
      <div class="category_title">Non-official groups</div>
      <Group
        v-for="group in non_official_groups"
        v-bind:group="group"
        v-bind:key="`non_official_group_${group.identity.low}`"
        v-bind:apiUrl="apiUrl"
        v-bind:groupPageUrl="groupPageUrl"
        v-on:selection="$emit('selection',$event)"
        v-bind:groupsOfUser="groups_of_user"/>

    </template>
    <loader v-if="non_official_groups_loading"/>

    <template v-if="!groups_loading && groups.length > 0">
      <div class="category_title">All groups</div>
      <Group
        v-for="group in groups"
        v-bind:group="group"
        v-bind:key="group.identity.low"
        v-bind:apiUrl="apiUrl"
        v-bind:groupPageUrl="groupPageUrl"
        v-on:selection="$emit('selection',$event)"
        v-bind:groupsOfUser="groups_of_user"/>

    </template>
    <loader v-if="groups_loading"/>



  </div>

</template>

<script>

import axios from 'axios'
import VueCookies from 'vue-cookies'
import Group from './Group.vue'
import Loader from '@moreillon/vue_loader'

export default {
  name: 'GroupPicker',
  props: {
    apiUrl: String,
    groupPageUrl: String,
    usersWithNoGroup: {
      type: Boolean,
      default(){return false}
    },
    distinguishOfficialGroups: {
      type: Boolean,
      default(){return true}
    }
  },
  components: {
    Group,
    Loader,

  },
  data(){
    return {
      groups_of_user: [],

      groups: [],
      groups_loading: false,

      official_groups: [],
      official_groups_loading: false,

      non_official_groups: [],
      non_official_groups_loading: false,
    }
  },
  mounted(){
    this.get_groups_of_current_user()
  },
  methods: {
    get_groups_of_current_user(){
      axios.get(`${this.apiUrl}/groups_of_user`, {
        headers: {
          Authorization: `Bearer ${VueCookies.get('jwt')}`
        }
      })
      .then(response => {
        this.groups_of_user.splice(0,this.groups_of_user.length)
        response.data.forEach((record) => {
          let group = record._fields[record._fieldLookup['group']]
          this.groups_of_user.push(group)
        });

      })
      .catch( () => {})
      .finally( () => {

        if(this.distinguishOfficialGroups){
          this.get_top_level_official_groups()
          this.get_top_level_non_official_groups()
        }
        else {
          this.get_all_top_level_groups()
        }


      })
    },
    get_all_top_level_groups(){
      this.groups_loading = true;

      axios.get(`${this.apiUrl}/top_level_groups`)
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
    get_top_level_official_groups(){
      //
      this.official_groups_loading = true;

      axios.get(`${this.apiUrl}/top_level_groups/official`)
      .then(response => {
        this.official_groups.splice(0,this.official_groups.length)
        response.data.forEach((record) => {
          let group = record._fields[record._fieldLookup['group']]
          this.official_groups.push(group)
        });

      })
      .catch( (error) => { console.log(error) })
      .finally( () => { this.official_groups_loading = false })

    },

    get_top_level_non_official_groups(){
      //
      this.non_official_groups_loading = true;

      axios.get(`${this.apiUrl}/top_level_groups/non_official`)
      .then(response => {
        this.non_official_groups.splice(0,this.non_official_groups.length)
        response.data.forEach((record) => {
          let group = record._fields[record._fieldLookup['group']]
          this.non_official_groups.push(group)
        });

      })
      .catch( (error) => { console.log(error) })
      .finally( () => { this.non_official_groups_loading = false })

    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.users_with_no_group{
  cursor: pointer;
  transition: background-color 0.25s;
  font-weight: bold;
}
.users_with_no_group:hover {
  color: #c00000;
}
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 150%;
  padding: 10px;
}

.category_title {
  font-weight: bold;
}

</style>
