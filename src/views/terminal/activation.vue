<template>
  <div class="app-container">
    <div class="filter-container">
 
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="发送手机号">
              <el-input  placeholder="发送手机号" v-model="listQuery.receivePhone"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
           <br> 
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">添加
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
      <el-table-column align="center" prop="cdkey" label="激活码" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="receivePhone" label="发送手机号" style="width: 60px;"> </el-table-column>
      <el-table-column align="center" label="激活状态" style="width: 60px;">
       <template slot-scope="scope">
          <el-tag type="success"  v-if="scope.row.status===1">已激活</el-tag>
          <el-tag type="primary"  v-else>未激活</el-tag>
        </template>    
     </el-table-column>
      <el-table-column align="center" prop="validateDays" label="有效期" style="width: 60px;"> </el-table-column>
      <el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
         <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" label="修改时间" width="170">
        <template slot-scope="scope">
         <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
        </template>
      </el-table-column> -->
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
      <el-form class="small-space" :model="tempArticle"  ref="tempArticle"   label-position="left" label-width="80px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="手机号" prop="phone" 
         :rules="[{ required: true, message: '手机号不能为空'}]">
          <el-input type="number"  v-model="tempArticle.phone"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="days" 
         :rules="[{ required: true, message: '有效期不能为空'}]">
          <el-input type="number"  v-model="tempArticle.days"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="createArticle('tempArticle')">提交</el-button>
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
          name: '',
          receivePhone: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '修改激活码',
          create: '新建激活码'
        },
        tempArticle: {
          id: "",
          days: "",
          phone: ""
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //查询列表
        if (!this.hasPerm('cdkey:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/cdkey/list",
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
        this.tempArticle.phone = "";
        this.tempArticle.days = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempArticle.id = this.list[$index].id;
        this.tempArticle.content = this.list[$index].f_business;
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createArticle(formName) {
          this.$refs[formName].validate((valid) => {
          if (valid) {
              //保存新文章
              this.api({
                url: "/cdkey/generate/send",
                method: "post",
                data: this.tempArticle
              }).then(() => {
                this.getList();
                this.dialogFormVisible = false
              })
          } else {
            return false;
          }
        });
      },
      updateArticle() {
        //修改文章
        this.api({
          url: "/article/updateArticle",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
    }
  }
</script>
