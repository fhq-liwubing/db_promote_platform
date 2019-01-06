<template>
  <div class="app-container">
    <div class="filter-container">
 
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="短信名称">
              <el-input  placeholder="短信名称" v-model="listQuery.templateName"></el-input>
            </el-form-item>
             <el-form-item label="短信类型">
          <el-select v-model="listQuery.templateType" placeholder="短信类型">
            <el-option label="默认模块1" value="1"></el-option>
            <el-option label="默认模块2" value="2"></el-option>
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
      <el-table-column align="center" prop="templateNo" label="短信编号" style="width: 100px;"></el-table-column>
      <el-table-column align="center" prop="templateName" label="短信名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center"  label="短信类型" style="width: 60px;">
         <template slot-scope="scope">
            <el-tag type="success"  v-if="scope.row.templateType===1">默认模块1</el-tag>
            <el-tag type="primary"  v-else>默认模块2</el-tag>
         </template>    
       </el-table-column>
      <el-table-column align="center" prop="content" label="短息内容" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注" style="width: 60px;"> </el-table-column>  
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
        <el-form-item label="短信名称" prop="templateName" 
         :rules="[{ required: true, message: '短信名称'}]">
          <el-input type="input"   v-model="tempArticle.templateName" > </el-input>
        </el-form-item>
        <el-form-item label="短信类型"  prop="templateType"
        :rules="[{ required: true, message: '短信名称'}]">
          <el-select v-model="tempArticle.templateType" placeholder="短信类型">
            <el-option label="默认模块1" value="1"></el-option>
            <el-option label="默认模块2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信内容" prop="content" 
         :rules="[{ required: true, message: '短信内容'}]">
          <el-input type="textarea"  :rows="3" v-model="tempArticle.content"></el-input>
        </el-form-item>
           <el-form-item label="备注" >
          <el-input type="textarea"  :rows="2" v-model="tempArticle.remark"></el-input>
        </el-form-item>
         <el-form-item>
            <el-button type="primary"  v-if="dialogStatus=='create'" @click="createArticle('tempArticle')">提交</el-button>
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
          templateName: '',
          templateType: ''
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
          templateName: "",
          content: "",
          remark: "",
          templateType: "",
          templateNo : ""
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //查询列表
        if (!this.hasPerm('msg:/template/list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/msg/template/list",
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
        this.tempArticle.templateType = "";
        this.tempArticle.templateName = "";
        this.tempArticle.content = "";
        this.tempArticle.remark = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempArticle.templateNo = this.list[$index].templateNo;
        this.tempArticle.templateType = this.list[$index].templateType;
        this.tempArticle.templateName = this.list[$index].templateName;
        this.tempArticle.content = this.list[$index].content;
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
              url: "/msg/template/add",
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
              url: "/msg/template/update",
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
