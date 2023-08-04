<template>
  <div class="group_picker">



      <!-- Official (non-user-made) groups -->
      <div class="category_title">Official groups</div>
      <template
        v-if="!official_groups_loading && official_groups.length">

        <Group
          v-for="(group, index) in official_groups"
          :group="group"
          :selectedGroupId="selectedGroupId"
          :groupsOfUser="groups_of_user"
          :key="`official_group_${index}`"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          @selection="$emit('selection',$event)" />

      </template>
      <loader v-if="official_groups_loading"/>
      <div
        class="group_picker_error"
        v-if="official_groups.error">
        Error loading groups
      </div>

      <!-- Non official (user mande) groups -->
      <div class="category_title">Non-official groups</div>
      <template
        v-if="!non_official_groups_loading && non_official_groups.length">
        <Group
          v-for="(group, index) in non_official_groups"
          :group="group"
          :selectedGroupId="selectedGroupId"
          :groupsOfUser="groups_of_user"
          :key="`non_official_group_${index}`"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          @selection="$emit('selection',$event)" />

      </template>
      <loader v-if="non_official_groups_loading"/>
      <div
        class="group_picker_error"
        v-if="non_official_groups_error">
        Error loading groups
      </div>

      <template v-if="!groups_loading && groups.length">
        <div class="category_title">All groups</div>
        <Group
          v-for="(group, index) in groups"
          :group="group"
          :selectedGroupId="selectedGroupId"
          :groupsOfUser="groups_of_user"
          :key="`any_${index}`"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          @selection="$emit('selection',$event)" />
      </template>

      <loader v-if="groups_loading"/>
      <div
        class="group_picker_error"
        v-if="groups_error">
        Error loading groups
      </div>

      <template v-if="usersWithNoGroup">
        <div class="category_title">Other</div>
        <div class="group_picker_group_container">

          <div class="group_picker_cannot_expand" />

          <!-- This return is stupid -->
          <div
            class="group_picker_name_container"
            @click="$emit('selection', {_id: 'none'})">
            <!-- <font-awesome-icon icon="users"/> -->
            <AccountMultipleIcon class="icon"/>
            <span>Users with no group</span>
          </div>
        </div>
      </template>


  </div>

</template>

<script>

import axios from 'axios'
import VueCookies from 'vue-cookies'
import Group from './Group.vue'
import Loader from '@moreillon/vue_loader'

import AccountMultipleIcon from 'vue-material-design-icons/AccountMultiple.vue';


export default {
  name: 'GroupPicker',
  props: {
    groupManagerApiUrl: {
      type: String,
      default: () => process.env.VUE_APP_GROUP_MANAGER_API_URL
    },
    groupManagerFrontUrl: {
      type: String,
      default: () => process.env.VUE_APP_GROUP_MANAGER_FRONT_URL
    },
    usersWithNoGroup: {
      type: Boolean,
      default: () => true 
    },
    distinguishOfficialGroups: {
      type: Boolean,
      default: () => true 
    },
    selectedGroupId: String,

  },
  components: {
    Group,
    Loader,
    AccountMultipleIcon


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
    const jwt = VueCookies.get('jwt') 
      || VueCookies.get('token')
      || localStorage.getItem('jwt')
      
    if( jwt && !axios.defaults.headers.common.Authorization){
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    }

    this.get_groups_of_current_user()
  },
  methods: {
    get_groups_of_current_user(){
      const url = `${this.groupManagerApiUrl}/v3/members/self/groups`
      axios.get(url)
      .then( ({data}) => { this.groups_of_user = data.items })
      .catch( () => {
        console.error(`Group picker failed to query groups of user`);
      })
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
      const params = {shallow: true}
      axios.get(url, {params})
      .then( ({data}) => { this.groups = data.items })
      .catch( (error) => {
        console.error(error)
        this.groups_error = error
      })
      .finally( () => { this.groups_loading = false })
    },
    get_top_level_official_groups(){

      this.official_groups_loading = true

      const url = `${this.groupManagerApiUrl}/v3/groups`
      const params = {shallow: true, official: true}
      axios.get(url, {params})
      .then( ({data}) => { this.official_groups = data.items })
      .catch( (error) => {
        console.error(error)
        this.official_groups_error = error
      })
      .finally( () => { this.official_groups_loading = false })

    },

    get_top_level_non_official_groups(){

      this.non_official_groups_loading = true

      const url = `${this.groupManagerApiUrl}/v3/groups`
      const params = {nonofficial: true, shallow: true}

      axios.get(url, {params})
      .then( ({data}) => { this.non_official_groups = data.items })
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

  overflow-y: auto;
  padding: 0.5em;

  border: 1px solid #dddddd;
}

.loader_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 150%;
  padding: 0 1em;
}

.category_title {
  font-weight: bold;
  margin: 0.75em 0;
}

</style>

<style>
/* Global styles */

.group_picker_error {
  color: #c00000;
}

.group_picker_name_container {

  display: flex;
  align-items: center;
  gap: 0.5em;


  flex-grow: 1;

  /* What color? */
  transition: color 0.25s;

  white-space: nowrap;
  overflow: hidden;

  /* Ellipsis does not work because of flex */
  text-overflow: ellipsis;

  cursor: pointer;
  transition: background-color 0.25s;
}


.group_picker_group_container {
  display: flex;
  align-items: center;
  gap: 0.5em;
  transition: background-color 0.25s;

}

.group_picker_group_container:hover {
  background-color: #88888888;
}

/* Properly aligning icons */
.group_picker .material-design-icon {
  display: flex;
  align-items: center;
}

.group_picker_avatar {
  height: 1.5em;
  width: 1.5em;
  object-fit: contain;
}

.group_picker_expand_button,
.group_picker_cannot_expand,
.group_picker_loader {
  height: 1.5em;
  width: 1.5em;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.group_picker_expand_button{
  /* center button in div */
  cursor: pointer;
  display: flex;



  transition:
    transform 0.25s,
    color 0.25s;
}

</style>
