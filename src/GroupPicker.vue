<template>
  <div class="group_picker">

    <!-- spacing wrapper used as artificial margin -->
    <div class="spacing_wrapper">



      <!-- Official (non-user-made) groups -->
      <div class="category_title">Official groups</div>
      <template
        v-if="!official_groups_loading && official_groups.length > 0">

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

      <div class="category_title">Non-official groups</div>
      <template
        v-if="!non_official_groups_loading && non_official_groups.length > 0">
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

      <div class="category_title">Other</div>
      <div class="group_container">
        <font-awesome-icon
          icon="minus"/>
          <div
            v-if="usersWithNoGroup"
            class="group_name_container"
            v-on:click="$emit('selection', null)">
            <font-awesome-icon icon="users"/>
            <span>Users with no group</span>
          </div>
      </div>

    </div>

  </div>

</template>

<script>

import axios from 'axios'
import VueCookies from 'vue-cookies'
import Group from './Group.vue'
import Loader from '@moreillon/vue_loader'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUsers,
  faChevronRight,
  faMinus,
  faInfoCircle,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUsers,
  faChevronRight,
  faInfoCircle,
  faMinus,
  faExternalLinkAlt,
)

export default {
  name: 'GroupPicker',
  props: {
    apiUrl: {
      type: String,
      default() {
        return process.env.VUE_APP_GROUP_MANAGER_API_URL
      }
    },
    groupPageUrl: {
      type: String,
      default() {
          if(process.env.VUE_APP_GROUP_MANAGER_FRONT_URL) {
            return `${process.env.VUE_APP_GROUP_MANAGER_FRONT_URL}/group`
          }
          else return null
        }
    },
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
    FontAwesomeIcon,


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
      axios.get(`${this.apiUrl}/members/self/groups`, {
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

      axios.get(`${this.apiUrl}/groups/top_level`)
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

      axios.get(`${this.apiUrl}/groups/top_level/official`)
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

      axios.get(`${this.apiUrl}/groups/top_level/non_official`)
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


.group_picker {

  /* put height 100%? */
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
  margin: 0.75em 0;
}


.spacing_wrapper {
  margin: 0.5em;
}

/* for the "users with no groups" groups */
.group_container {
  display: flex;
  align-items: center;
  transition: background-color 0.25s;
}

.group_container:hover {
  background-color: #eeeeee;
}

.group_container > * {
  cursor: pointer;
}

.group_name_container {
  margin-left: 0.5em;
  flex-grow: 1;
  transition: color 0.25s;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.group_name_container > *:not(:last-child) {
  margin-right: 0.5em;
}

.group_name_container{
  cursor: pointer;
  transition: background-color 0.25s;
}


</style>
