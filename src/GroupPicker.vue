<template>
  <div class="group_picker">

    <!-- spacing wrapper used as artificial margin -->
    <div class="spacing_wrapper">

      <!-- Official (non-user-made) groups -->
      <div class="category_title">Official groups</div>
      <template
        v-if="!official_groups_loading && official_groups.length">

        <Group
          v-for="(group, index) in official_groups"
          :group="group"
          :key="`official_group_${index}`"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          v-on:selection="$emit('selection',$event)"
          :groupsOfUser="groups_of_user"/>

      </template>
      <loader v-if="official_groups_loading"/>
      <div
        class="error_message"
        v-if="official_groups.error">
        Error loading groups
      </div>

      <div class="category_title">Non-official groups</div>
      <template
        v-if="!non_official_groups_loading && non_official_groups.length">
        <Group
          v-for="(group, index) in non_official_groups"
          :group="group"
          :key="`non_official_group_${index}`"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          v-on:selection="$emit('selection',$event)"
          :groupsOfUser="groups_of_user"/>

      </template>
      <loader v-if="non_official_groups_loading"/>
      <div
        class="error_message"
        v-if="non_official_groups_error">
        Error loading groups
      </div>

      <template v-if="!groups_loading && groups.length">
        <div class="category_title">All groups</div>
        <Group
          v-for="(group, index) in groups"
          :group="group"
          :key="`any_${index}`"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          v-on:selection="$emit('selection',$event)"
          :groupsOfUser="groups_of_user"/>

      </template>
      <loader v-if="groups_loading"/>
      <div
        class="error_message"
        v-if="groups_error">
        Error loading groups
      </div>

      <template v-if="usersWithNoGroup">
        <div class="category_title">Other</div>
        <div class="group_container">
          <font-awesome-icon
            icon="minus"/>

          <!-- This return is stupid -->
          <div
            class="group_name_container"
            v-on:click="$emit('selection', {identity: 'none', properties: {_id: 'none'}})">
            <font-awesome-icon icon="users"/>
            <span>Users with no group</span>
          </div>
        </div>
      </template>

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

    groupManagerApiUrl: {
      type: String,
      default() {
        return process.env.VUE_APP_GROUP_MANAGER_API_URL
      }
    },
    groupManagerFrontUrl: {
      type: String,
      default() {
        return process.env.VUE_APP_GROUP_MANAGER_FRONT_URL
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
      groups_error: null,

      official_groups: [],
      official_groups_loading: false,
      official_groups_error: null,

      non_official_groups: [],
      non_official_groups_loading: false,
      non_official_groups_error: null,
    }
  },
  mounted(){

    // Configure axios to use jwt in cookies
    const jwt = VueCookies.get('jwt') || VueCookies.get('token')
    if( jwt && !axios.defaults.headers.common.Authorization){
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    }

    this.get_groups_of_current_user()
  },
  methods: {
    get_groups_of_current_user(){
      axios.get(`${this.groupManagerApiUrl}/v3/members/self/groups`)
      .then( ({data}) => { this.groups_of_user = data })
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

      this.groups_loading = true

      const url = `${this.groupManagerApiUrl}/v3/groups`
      const params = {top: true}
      axios.get(url, {params})
      .then( ({data}) => { this.groups = data.groups })
      .catch( (error) => {
        console.error(error)
        this.groups_error = error
      })
      .finally( () => { this.groups_loading = false })
    },
    get_top_level_official_groups(){

      this.official_groups_loading = true

      const url = `${this.groupManagerApiUrl}/v3/groups`
      const params = {top: true, official: true}
      axios.get(url, {params})
      .then( ({data}) => { this.official_groups = data.groups })
      .catch( (error) => {
        console.error(error)
        this.official_groups_error = error
      })
      .finally( () => { this.official_groups_loading = false })

    },

    get_top_level_non_official_groups(){

      this.non_official_groups_loading = true

      const url = `${this.groupManagerApiUrl}/v3/groups`
      const params = {nonofficial: true, top: true}

      axios.get(url, {params})
      .then( ({data}) => { this.non_official_groups = data.groups })
      .catch( (error) => {
        console.error(error)
        this.non_official_groups_error = error
      })
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

.error_message {
  color: #c00000;
}
</style>
