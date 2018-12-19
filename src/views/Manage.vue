<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%; background-color: #324057;">
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="defaultActive"
          background-color="#324057"
          style="min-height: 100%;"
          text-color="#fff"
          router
        >
          <el-menu-item index="home">
            <i class="el-icon-menu"></i>首页
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>数据管理
            </template>
            <el-menu-item index="home">用户列表</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;" v-if="reloading">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      reloading: true
    };
  },
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  },
  methods: {
    reload() {
      this.reloading = false;
      this.$nextTick(() => {
        this.reloading = true;
      });
    }
  }
};
</script>


<style lang="less" scoped>
@import "../style/mixin";
</style>