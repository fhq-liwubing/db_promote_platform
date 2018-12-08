<template>
  <div class="app-container">
    <div class="filter-container">
 
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="省份">
              <el-input  placeholder="省份" v-model="listQuery.provinces"></el-input>
            </el-form-item>
             <el-form-item label="城市">
              <el-input  placeholder="城市" v-model="listQuery.city"></el-input>
            </el-form-item>
              <el-form-item label="简介">
              <el-input  placeholder="简介" v-model="listQuery.business"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
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
      <el-table-column align="center" prop="f_compay_name" label="公司名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_provinces" label="省份" style="width: 60px;"> </el-table-column>
      <el-table-column align="center" prop="f_city" label="城市" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_acc_name" label="联系人姓名" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_phone" label="手机号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_addr" label="公司地址" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="f_source_type" label="来源" style="width: 60px;"> </el-table-column>
       <el-table-column align="center" prop="f_mail" label="邮箱" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.f_create_time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">查看简介</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempArticle" label-position="left" label-width="60px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="简介">
          <el-input type="textarea" style="width:600px;"  :disabled="true"  :rows="6" v-model="tempArticle.content">
          </el-input>
           
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
          business: '',
          provinces: '',
          city:  ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '查看',
          create: '创建文章'
        },
        tempArticle: {
          id: "",
          content: ""
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //查询列表
        if (!this.hasPerm('companyOrigin:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/companyOrigin/listCompanyOrigin",
          method: "get",
          params: this.listQuery
        }).then(data => {
           console.log(data);
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
