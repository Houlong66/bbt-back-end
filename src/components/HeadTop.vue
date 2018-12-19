<template>
  <div class="header_container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta.label" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @command="handleCommand" menu-align="start">
      <img src="images/header.jpg" class="avator">
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">首页</el-dropdown-item>
        <el-dropdown-item command="singout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
// import {mapActions, mapState} from 'vuex'
  export default {
    name: 'headTop',
    data(){
      return {
      }
    },
    created(){
    },
  methods: {
    handleCommand(command) {
      if (command == 'home') {
        this.$router.push('/home');
      }else if(command == 'singout'){
        this.axios.get(`/admin/logout`).then((res) => {
          if (res.data.state === 0) {
            this.$router.push('/')
          } else {
            this.$message.error(`错误码${res.data.state}`)
          }
        })
        }
      }
    },
  }
</script>

<style lang="less">
@import "../style/mixin";
.header_container {
  background-color: #eff2f7;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}
.avator {
  .wh(36px, 36px);
  border-radius: 50%;
  margin-right: 37px;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>