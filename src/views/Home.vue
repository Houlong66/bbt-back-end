<template>
  <div class="fillcontain">
    <head-top></head-top>
    <el-row class="register-button" justify="space-between" type="flex">
      <el-col :span="3" :offset="1">
        <el-input placeholder="请输入学号" v-model="search_key">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click.native="register">注册新用户</el-button>
      </el-col>
    </el-row>
    <div class="table_container">
      <el-table :data="tableData" highlight-current-row height="500">
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column property="stuid" label="学号" width="220"></el-table-column>
        <el-table-column property="name" label="用户姓名" width="220"></el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">{{ departText(scope.row) }}</template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">{{ positionText(scope.row) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click.native="modify(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="showPwdDialog(scope.row)">修改密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>-->
    </div>
    <el-dialog :title="dialog_title" :visible.sync="dialog" width="500px">
      <el-form :model="form">
        <el-form-item label="年级" :label-width="formLabelWidth" v-if="dialog_type==1">
          <el-select v-model="form.period" placeholder="请选择年级">
            <el-option label="2018" value="2018"></el-option>
            <el-option label="2017" value="2017"></el-option>
            <el-option label="2016" value="2016"></el-option>
            <el-option label="2015" value="2015"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" v-if="dialog_type==1">
          <el-input v-model="form.initpwd" autocomplete="off" style="width:300px" placeholder="输入密码"></el-input>
        </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="form.stuid" autocomplete="off" style="width:300px" placeholder="输入学号"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width:300px" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-select v-model="form.departid" placeholder="请选择部门">
            <el-option
              v-for="(value) in depart_items"
              :key="value.id"
              :label="value.label"
              :value="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" :label-width="formLabelWidth">
          <el-select v-model="form.position" placeholder="请选择职位">
            <el-option
              v-for="(value) in position_items"
              :key="value.id"
              :label="value.label"
              :value="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="submit" :disabled="!ready_submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="pwd_dialog" width="500px">
      <el-form :model="form2" status-icon :rules="rules2" ref="form2">
        <el-form-item label="密码" prop="pass" :label-width="formLabelWidth">
          <el-input type="password" v-model="form2.pass" autocomplete="off" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :label-width="formLabelWidth">
          <el-input
            type="password"
            v-model="form2.checkPass"
            autocomplete="off"
            style="width:300px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwd_dialog = false">取 消</el-button>
        <el-button type="primary" @click="changePwd('form2')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "../components/HeadTop";
export default {
  inject: ['reload'],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (value.length < 4) {
          callback(new Error("密码小于4位"));
        }
        if (this.form2.checkPass !== "") {
          this.$refs.form2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // dialog数据
      dialog: false,
      dialog_title: "",
      form: {
        stuid: "",
        name: "",
        departid: null,
        position: null,
        period: "",
        initpwd: "",
        userid: null
      },
      formLabelWidth: "80px",
      dialog_type: 1, // 1为注册新用户，2为编辑用户
      ready_submit: false,
      // **************
      // pwd_dialog数据
      pwd_dialog: false,
      form2: {
        pass: "",
        checkPass: "",
        stuid: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      // *****************
      search_key: "",
      time_out: null,
      // 获取的全部数据
      originData: [
        {
          stuid: "",
          name: "",
          departid: null,
          position: null
        }
      ],
      // 显示的数据
      tableData: [],
      depart_items: [
        { id: 1, label: "秘书部" },
        { id: 2, label: "文艺部" },
        { id: 3, label: "宣传部" },
        { id: 4, label: "体育部" },
        { id: 5, label: "新媒体中心" },
        { id: 6, label: "心光志愿者部" },
        { id: 7, label: "调研部" },
        { id: 8, label: "生活部" },
        { id: 9, label: "素质拓展认证中心" },
        { id: 10, label: "学术部" },
        { id: 11, label: "组织部" },
        { id: 12, label: "外联部" },
        { id: 13, label: "常委" },
        { id: 14, label: "其他" }
      ],
      position_items: [
        { id: 1, label: "干事" },
        { id: 2, label: "副部长" },
        { id: 3, label: "部长" },
        { id: 4, label: "常委" },
        { id: 5, label: "主席" },
        { id: 6, label: "其他" }
      ]
    };
  },
  components: {
    headTop
  },
  watch: {
    search_key: function() {
      clearTimeout(this.time_out);
      this.time_out = setTimeout(() => {
        this.searchStuid();
      }, 400);
    },
    form: {
      handler(newV) {
        for (let key in newV) {
          if (key == 'userid') continue;
          if ((key == 'period' || key == 'initpwd') && this.dialog_type == 2) continue;
          if (!newV[key]) {
            this.ready_submit = false;
            return;
          }
          if (key == "initpwd" && newV[key].length < 4 && this.dialog_type == 1) {
            this.ready_submit = false;
            return;
          }
        }
        this.ready_submit = true;
      },
      deep: true
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.axios.get(`/admin/scanall`).then(res => {
        if (res.data.state === 0) {
          this.originData = res.data.stulist;
          this.tableData = this.originData;
        } else if (res.data.state === 50) {
          this.$router.push("/");
        } else {
          this.$message({
            message: `错误码${res.data.state}`,
            type: "error"
          });
        }
      });
    },
    searchStuid() {
      this.tableData = [];
      this.originData.forEach(value => {
        if (value.stuid.indexOf(this.search_key) !== -1) {
          this.tableData.push(value);
        }
      });
    },
    register() {
      this.dialog_type = 1;
      this.dialog = true;
      this.dialog_title = "注册新用户";
      for (let key in this.form) {
        this.form[key] = null;
      }
    },
    modify(item) {
      this.dialog_title = "编辑用户信息";
      this.dialog_type = 2;
      this.dialog = true;
      for (let key in this.form) {
        this.form[key] = item[key];
      }
    },
    departText(item) {
      return [
        "",
        "秘书部",
        "文艺部",
        "宣传部",
        "体育部",
        "新媒体中心",
        "心光志愿者部",
        "调研部",
        "生活部",
        "素质拓展认证中心",
        "学术部",
        "组织部",
        "外联部",
        "常委",
        "其他"
      ][item.departid];
    },
    positionText(item) {
      return ["", "干事", "副部长", "部长", "常委", "主席", "其他"][
        item.position
      ];
    },
    submit() {
      let url = "";
      let temp_data = {};
      if (this.dialog_type == 1) {
        url = `/admin/register`;
        temp_data = {
          period: this.form.period,
          initpwd: this.form.initpwd,
          stulist: [
            {
              stuid: this.form.stuid,
              name: this.form.name,
              depart: this.form.departid,
              position: this.form.position
            }
          ]
        };
      } else if (this.dialog_type == 2) {
        url = `/admin/revise`;
        temp_data = {
          userid: this.form.userid,
          stuid: this.form.stuid,
          name: this.form.name,
          depart: this.form.departid,
          position: this.form.position
        }
      }
      this.axios.post(url, temp_data).then(res => {
        if (res.data.state === 0) {
          if (this.dialog_type == 1) {
            this.$message({
              message: "注册成功！",
              type: "success"
            });
            this.form = {
              stuid: "",
              name: "",
              departid: null,
              position: null,
              period: temp_data.period,
              initpwd: temp_data.initpwd,
              userid: null
            };
          }
          else if (this.dialog_type == 2) {
            this.$message({
              message: "修改成功！",
              type: "success"
            })
            this.reload()
          }
        } else {
          this.$message.error(`状态码${res.data.state}`)
        }
      });
    },
    changePwd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temp_data = {
            stuid: this.form2.stuid,
            initpwd: this.form2.pass
          };
          this.axios.post(`/admin/initpwd`, temp_data).then(res => {
            if (res.data.state === 0) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.pwd_dialog = false;
            } else {
              this.$message.error(`状态码${res.data.state}`);
            }
          });
        } else {
          this.$message.error("error submit!!");
          return false;
        }
      });
    },
    showPwdDialog(item) {
      this.pwd_dialog = true;
      this.form2 = {
        pass: "",
        checkPass: "",
        stuid: item.stuid
      };
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}
.register-button {
  margin-top: 20px;
}
</style>