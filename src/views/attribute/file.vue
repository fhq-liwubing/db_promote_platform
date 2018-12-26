<template>
  <div class="app-container">
    <div class="filter-container">
 
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="文件名称">
              <el-input  placeholder="文件名称" v-model="listQuery.name"></el-input>
            </el-form-item>
             <el-form-item label="文件所属">
          <el-select v-model="listQuery.sex" placeholder="文件所属">
            <el-option label="系统" value="默认模块1"></el-option>
            <el-option label="个人" value="个人"></el-option>
          </el-select>
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
      <el-table-column align="center" prop="name" label="文件名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="phoneNo" label="文件路径" style="width: 60px;"> </el-table-column>
      <el-table-column align="center" prop="email" label="文件所属" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="email" label="终端识别码" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="创建时间" width="170">
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
        <el-form-item label="短信名称" prop="name" 
         :rules="[{ required: true, message: '短信名称'}]">
          <el-input type="name"   v-model="tempArticle.name" > </el-input>
        </el-form-item>
        <el-form-item label="短信类型">
          <el-select v-model="tempArticle.sex" placeholder="短信类型">
            <el-option label="默认模块1" value="默认模块1"></el-option>
            <el-option label="默认模块2" value="默认模块2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信内容" prop="phone" 
         :rules="[{ required: true, message: '短信内容'}]">
          <el-input type="phone"  v-model="tempArticle.phone"></el-input>
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
          phoneNo: ''
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
        if (!this.hasPerm('employee:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/employee/listEmployee",
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
      createArticle(formName) {
        console.log(this.tempArticle.province);
        this.$refs[formName].validate((valid) => {
          if (valid) {

           //保存新文章
            this.api({
              url: "/article/addArticle",
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
