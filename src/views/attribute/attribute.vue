<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="自定义标签" name="first">
      意向客户<br><br>
      <el-tag
  :key="tag"
  v-for="tag in dynamicTags"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)">
  {{tag}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>
     <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      <br><br>  
      无意向<br><br>

      无关电话<br><br>

      未接通<br><br>


    </el-tab-pane>
    <el-tab-pane label="进度标签" name="second">
      进度标签
    </el-tab-pane>
    <el-tab-pane label="评分标签" name="third">
      评分标签
    </el-tab-pane>
  </el-tabs>
</template>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

<script>
  export default {
    data() {
      return {
        activeName: 'first',
        dynamicTags: [],
        inputVisible: false,
        inputValue: ''
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    
    }
  };
</script>