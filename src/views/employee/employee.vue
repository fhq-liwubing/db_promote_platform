<template>
  <div class="app-container">
    <div class="filter-container">
 
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="员工姓名">
              <el-input  placeholder="员工姓名" v-model="listQuery.username"></el-input>
            </el-form-item>
             <el-form-item label="员工手机号">
              <el-input  placeholder="员工手机号" v-model="listQuery.selfPhone"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
           <br> 
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('employee:add')">添加
          </el-button>
        </el-form-item> 
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="username" label="员工姓名" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="selfPhone" label="手机号" style="width: 60px;"> </el-table-column>
      <!-- <el-table-column align="center" prop="email" label="年龄" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="sex" label="性别" style="width: 60px;"></el-table-column> -->
      <el-table-column align="center"  label="在岗状态" style="width: 60px;">
         <template slot-scope="scope">
          <el-tag type="success"  v-if="scope.row.state===1">在岗</el-tag>
          <el-tag type="primary"  v-else>离职</el-tag>
        </template>    
      </el-table-column>
        <el-table-column align="center" prop="remark" label="备注" style="width: 60px;"></el-table-column>
     
       <el-table-column align="center"  label="负责终端数" style="width: 60px;">
          <template slot-scope="scope">
             <span>{{scope.row.terminalCount}}</span>
           </template>

       </el-table-column>
      <el-table-column align="center" label="入职时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('employee:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <el-form class="small-space" :model="tempArticle" ref="tempArticle"  label-position="left" label-width="80px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="员工姓名" prop="username" 
         :rules="[{ required: true, message: '员工姓名不能为空'}]">
          <el-input type="input"   v-model="tempArticle.username" > </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="selfPhone" 
         :rules="[{ required: true, message: '手机号不能为空'}]">
          <el-input type="input"  v-model="tempArticle.selfPhone"></el-input>
        </el-form-item>
        <el-form-item label="备注"  >
          <el-input type="input"  v-model="tempArticle.remark"></el-input>
        </el-form-item>
         <el-form-item>
             <el-button type="primary" v-if="dialogStatus=='create'"  @click="createArticle('tempArticle')">提交</el-button>
             <el-button type="primary" v-else @click="updateArticle('tempArticle')">修 改</el-button>
        </el-form-item>
      
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 50,//每页条数
          username: '',
          selfPhone: ''
        },
        province: [],//角色列表
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '修改员工',
          create: '创建员工'
        },
        tempArticle: {
          id: "",
          username: "",
          selfPhone:"",
          employeeNo:"",
          remark: "",
        }
      }
    },
    created() {
      this.getList();
      if (this.hasPerm('employee:add') || this.hasPerm('employee:update')) {
        this.getAllCity();
      }
   
    },
    methods: {
    getAllCity() {
        //查询所有城市
        this.api({
          url: "/common/city",
          dataType:"json",
          method: "get"
        }).then(data => {
        this.tempArticle.options = data;
        })
      },
      getList() {
        //查询列表
        if (!this.hasPerm('employee:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/employee/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
         
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      showCreate() {
        //显示新增对话框
        this.tempArticle.username = "";
        this.tempArticle.selfPhone = "";
        this.tempArticle.remark = "";

        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempArticle.id = this.list[$index].id;
        this.tempArticle.username = this.list[$index].username;
        this.tempArticle.selfPhone = this.list[$index].selfPhone;
        this.tempArticle.employeeNo = this.list[$index].employeeNo;
        this.tempArticle.remark = this.list[$index].remark;

        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createArticle(formName) {
        console.log(this.tempArticle.province);
        this.$refs[formName].validate((valid) => {
          if (valid) {

           //保存新文章
            this.api({
              url: "/employee/add",
              method: "post",
              data: this.tempArticle
            }).then(() => {
              this.getList();
              this.dialogFormVisible = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
      },
      updateArticle(formName) {
        this.$refs[formName].validate((valid) => {
        if (valid) {
            //修改文章
            this.api({
              url: "/employee/update",
              method: "post",
              data: this.tempArticle
            }).then(() => {
              this.getList();
              this.dialogFormVisible = false
            })
         } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  }
</script>
