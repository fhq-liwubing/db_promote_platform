<template>
  <div class="app-container">
    <div class="filter-container">
 
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="终端识别码">
              <el-input  placeholder="终端识别码" v-model="listQuery.terminalNo"></el-input>
            </el-form-item>
             <el-form-item label="手机号码">
              <el-input  placeholder="手机号码" v-model="listQuery.phoneNo"></el-input>
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
      <el-table-column align="center" prop="terminalNo" label="终端识别码" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="phoneNo" label="绑定手机号" style="width: 60px;"> </el-table-column>
      <!-- <el-table-column align="center" prop="updateTime" label="修改时间" style="width: 60px;"></el-table-column> -->
      <el-table-column align="center" label="分配时间" width="170">
        <template slot-scope="scope">
           <span>{{scope.row.assignTime}}</span>
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
      <el-form class="small-space" :model="tempArticle" label-position="left" label-width="100px"
               style='width: 500px; margin-left:60px;'>
        <el-form-item label="终端识别码" prop="terminalNo" >
        <el-input type="input"   v-model="tempArticle.terminalNo"> </el-input>
        </el-form-item>
        <el-transfer
          filterable
          filter-placeholder="请输入手机号"
          v-model="value2"
          :data="data2">
        </el-transfer>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createArticle">创 建</el-button>
        <el-button type="primary" v-else @click="updateArticle">修 改</el-button>
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
          terminalNo: '',
          phoneNo: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '修改终端',
          create: '创建终端'
        },
        tempArticle: {
          id: "",
          terminalNo: "",
          phoneNos: []
        },
        data2:[],
        value2: [],
        // filterMethod(query, item) {
        //   return item.pinyin.indexOf(query) > -1;
        // }
      }
    },
    created() {
      this.getList();
      this.getCities();
    },
    methods: {
     getCities(){
        const data3 = [];
        this.api({
            url: "/phone/all",
            async: false,//同步请求
            method: "get"
          }).then(data => {
            console.log(data);
            data.forEach((city, index) => {
            data3.push({
              label: city,
              key: city
             });
           });
          this.data2=data3;
          })
     },
      getList() {
       
        //查询列表
        if (!this.hasPerm('assignation:phone/list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/assignation/phone/list",
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
        this.tempArticle.terminalNo = "";
        this.tempArticle.phoneNos = [];
        this.value2 = [];
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
        if(this.value2.length==0){
          this.$message.error('请选择手机号！');
          return ;
        }else if(this.tempArticle.terminalNo==""){
          this.$message.error('请选择终端识别码！');
          return ;
        }
        this.tempArticle.phoneNos = this.value2;
        //保存新文章
        this.api({
          url: "/assignation/phone/assign",
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
      }
        
    }
  }
</script>
