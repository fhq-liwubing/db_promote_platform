<template>
  <div class="app-container">
    <div class="filter-container">
 
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="手机卡号">
              <el-input  placeholder="手机卡号" v-model="listQuery.phoneNo"></el-input>
            </el-form-item>
             <el-form-item label="卡主姓名">
              <el-input  placeholder="卡主姓名" v-model="listQuery.ownerName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
           <br> 
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">添加
          </el-button>
        </el-form-item> 
        <el-form-item>
          <el-button type="primary" icon="plus" v-if="hasPerm('article:add')">批量模块下载
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus"  v-if="hasPerm('article:add')">批量上传
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
      <el-table-column align="center" prop="phoneNo" label="手机卡号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="ownerName" label="卡主姓名" style="width: 60px;"> </el-table-column>
       <el-table-column align="center" prop="idCardNo" label="身份证号" style="width: 60px;"> </el-table-column>
      <el-table-column align="center" prop="wechatNo" label="微信号" style="width: 60px;"> </el-table-column>
      <el-table-column align="center" prop="wechatName" label="微信昵称" style="width: 60px;"> </el-table-column>
      <el-table-column align="center" prop="payPassword" label="支付密码" style="width: 200px;"> </el-table-column>
      <el-table-column align="center" prop="dataRemain" label="流量信息" style="width: 200px;"> </el-table-column>
      <el-table-column align="center" prop="callRemain" label="通话信息" style="width: 200px;"> </el-table-column>
      <el-table-column align="center" prop="msgRemain" label="短信信息" style="width: 200px;"> </el-table-column>
      <el-table-column align="center" prop="remark" label="备注" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="state" label="状态" style="width: 60px;"></el-table-column>
      <!-- <el-table-column align="center" prop="updateTime" label="修改时间" style="width: 60px;"></el-table-column> -->
      <el-table-column align="center" label="创建时间" >
        <template slot-scope="scope">
          <span>{{scope.row.createTime.year}}-{{scope.row.createTime.monthValue}}-{{scope.row.createTime.monthValue}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">
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
      <el-form :inline="true"  class="demo-form-inline" :model="tempArticle" ref="tempArticle" label-position="left" label-width="80px"
               style='width: 500px; margin-left:50px;'>
        <el-form-item label="手机卡号" prop="phoneNo" 
         :rules="[{ required: true, message: '手机卡号不能为空'},  { min: 11, max: 11, message: '长度必须为11位', trigger: 'blur' }]">
          <el-input type="number"  v-model="tempArticle.phoneNo"> </el-input>
        </el-form-item>
        <el-form-item label="卡主姓名" prop="ownerName" 
         :rules="[{ required: true, message: '卡主姓名不能为空'}]">
          <el-input type="input"  v-model="tempArticle.ownerName"></el-input>
        </el-form-item>
         <el-form-item label="身份证号" prop="idCardNo" 
         :rules="[{ required: true, message: '身份证号不能为空'}]">
          <el-input type="input"  v-model="tempArticle.idCardNo"></el-input>
        </el-form-item>
         <el-form-item label="微信号" prop="wechatNo" 
         :rules="[{ required: true, message: '微信号不能为空'}]">
          <el-input type="input"  v-model="tempArticle.wechatNo"></el-input>
        </el-form-item>
         <el-form-item label="微信昵称" prop="wechatName" 
         :rules="[{ required: true, message: '微信昵称不能为空'}]">
          <el-input type="input"  v-model="tempArticle.wechatName"></el-input>
        </el-form-item>
        <el-form-item label="支付密码" prop="payPassword" 
         :rules="[{ required: true, message: '支付密码不能为空'}]">
          <el-input type="password"  v-model="tempArticle.payPassword"></el-input>
        </el-form-item>
        <el-form-item label="流量信息" prop="dataRemain" 
         :rules="[{ required: true, message: '流量信息不能为空'}]">
          <el-input type="input"  v-model="tempArticle.dataRemain"></el-input>
        </el-form-item>
        <el-form-item label="通话信息" prop="callRemain" 
         :rules="[{ required: true, message: '通话信息不能为空'}]">
          <el-input type="input"  v-model="tempArticle.callRemain"></el-input>
        </el-form-item>
         <el-form-item label="短信信息" prop="msgRemain" 
         :rules="[{ required: true, message: '短信信息不能为空'}]">
          <el-input type="input"  v-model="tempArticle.msgRemain"></el-input>
        </el-form-item>
         <el-form-item label="备注" prop="remark" >
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
          ownerName: '',
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
        if (!this.hasPerm('phone:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/phone/list",
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
        this.tempArticle.phoneNo = "";
        this.tempArticle.idCardNo = "";
        this.tempArticle.ownerName = "";
        this.tempArticle.dataRemain = "";
        this.tempArticle.callRemain = "";
        this.tempArticle.msgRemain = "";
        this.tempArticle.wechatNo = "";
        this.tempArticle.wechatName = "";
        this.tempArticle.payPassword = "";
        
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempArticle.id = this.list[$index].id;
        this.tempArticle.content = this.list[$index].content;
        this.tempArticle.phoneNo = this.list[$index].phoneNo;
        this.tempArticle.idCardNo = this.list[$index].idCardNo;
        this.tempArticle.ownerName = this.list[$index].ownerName;
        this.tempArticle.dataRemain = this.list[$index].dataRemain;
        this.tempArticle.callRemain = this.list[$index].callRemain;
        this.tempArticle.msgRemain = this.list[$index].msgRemain;
        this.tempArticle.wechatNo = this.list[$index].wechatNo;
        this.tempArticle.wechatName = this.list[$index].wechatName;
        this.tempArticle.payPassword = this.list[$index].payPassword;
        this.tempArticle.remark = this.list[$index].remark;
      

        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createArticle(formName) {
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.api({
                url: "/phone/add",
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
      updateArticle(formName) {
         this.$refs[formName].validate((valid) => {
          if (valid) {
            //修改文章
            this.api({
              url: "/phone/update",
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
    }
  }
</script>
