<template>
  <div class="app-container">
    <div class="filter-container">
 
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="公司名称">
              <el-input  placeholder="公司名称" v-model="listQuery.username"></el-input>
            </el-form-item>
             <el-form-item label="员工姓名">
              <el-input  placeholder="员工姓名" v-model="listQuery.employeeNo"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
           <br> 
       <!-- <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">添加
          </el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="username" label="公司名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="employeeNo" label="省份" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_acc_name" label="城市" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_phone" label="联系人姓名" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_phone" label="手机号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_phone" label="公司地址" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_phone" label="所属员工" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="通话时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.f_create_time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">查看详情</el-button>
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
      <el-form class="small-space" :model="tempArticle" label-position="left" label-width="80px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="员工姓名" prop="name" >
          <el-input type="input"   v-model="tempArticle.content"> </el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input type="input"  v-model="tempArticle.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="tempArticle.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createArticle">创 建</el-button>
        <!-- <el-button type="primary" v-else @click="updateArticle">修 改</el-button> -->
      </div>
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
          phone: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '修改员工',
          create: '创建员工'
        },
        tempArticle: {
          id: "",
          content: "",
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
        if (!this.hasPerm('terminal:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/terminal/listTerminal",
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
        this.tempArticle.content = "";
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
      createArticle() {
        //保存新文章
        this.api({
          url: "/article/addArticle",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
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
