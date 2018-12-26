import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'


const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard', component: _import('dashboard/index')
    }]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  
  {
    path: '/user',
    component: Layout,
    redirect: '/user/',
    name: '',
    meta: {title: '用户权限', icon: 'table'},
    children: [
      {
        path: '', name: '用户列表', component: _import('user/user'), meta: {title: '用户列表', icon: 'user'}, menu: 'user'
      },
      {
        path: 'role',
        name: '权限管理',
        component: _import('user/role'),
        meta: {title: '权限管理', icon: 'password'},
        menu: 'role'
      },
    ]
  },{
    path: '/system',
    component: Layout,
    redirect: '/system/article',
    name: '客户端管理',
    meta: {title: '客户端管理', icon: 'tree'},
    children: [
      {
        path: 'employee',
        name: '员工管理',
        component: _import('employee/employee'),
        meta: {title: '员工管理', icon: 'user'},
        menu: '员工管理'
      }, {
        path: 'terminal',
        name: '终端管理',
        component: _import('terminal/terminal'),
        meta: {title: '终端管理', icon: 'user'},
        menu: '终端管理'
      },{
        path: '',
        name: '手机号管理',
        component: _import('terminal/phone'),
        meta: {title: '手机号管理', icon: 'example'},
        menu: '手机号管理'
      },{
        path: 'activation',
        name: '激活码',
        component: _import('terminal/activation'),
        meta: {title: '激活码', icon: 'example'},
        menu: '激活码'
      },{
        path: 'terminalPhone',
        name: '手机号分配',
        component: _import('terminal/terminalPhone'),
        meta: {title: '手机号分配', icon: 'example'},
        menu: '手机号分配'
      },{
        path: 'terminalEmployee',
        name: '终端分配',
        component: _import('terminal/terminalEmployee'),
        meta: {title: '终端分配', icon: 'example'},
        menu: '终端分配'
      },
    ]
  },{
    path: '/sms',
    component: Layout,
    redirect: '/task/',
    name: '',
    meta: {title: '任务管理', icon: 'table'},
    children: [
      {
        path: 'task',
        name: '任务包维护',
        component: _import('task/package'),
        meta: {title: '任务包维护', icon: 'example'},
        menu: '任务包维护'
      }, {
        path: 'taskFlsh',
        name: '任务包发配',
        component: _import('task/taskFlsh'),
        meta: {title: '任务包发配', icon: 'example'},
        menu: '任务包发配'
      }
    ]
  }, {
    path: '/company',
    component: Layout,
    redirect: '/company/',
    name: '',
    meta: {title: '客户资料管理', icon: 'table'},
    children: [
      {
        path: 'companyOrigin',
        name: '客户资料来源',
        component: _import('company/companyOrigin'),
        meta: {title: '客户资料来源', icon: 'user'},
        menu: '客户资料来源'
      }, {
        path: 'company',
        name: '客户资料',
        component: _import('company/company'),
        meta: {title: '客户资料', icon: 'example'},
        menu: '客户资料'
      },
    ]
  }, {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/',
    name: '',
    meta: {title: '统计管理', icon: 'table'},
    children: [
      {
        path: 'statisticsCompany',
        name: '任务完成度统计',
        component: _import('statistics/statisticsCompany'),
        meta: {title: '任务完成度统计', icon: 'example'},
        menu: '任务完成度统计'
      },{
        path: 'intention',
        name: '意向客户查询',
        component: _import('statistics/intentionCompany'),
        meta: {title: '意向客户查询', icon: 'example'},
        menu: '意向客户查询'
      },
    ]
  },{
    path: '/attribute',
    component: Layout,
    redirect: '/attribute/',
    name: '',
    meta: {title: '基础数据管理', icon: 'table'},
    children: [
      {
        path: 'attribute',
        name: '任务属性配置',
        component: _import('attribute/attribute'),
        meta: {title: '任务属性配置', icon: 'example'},
        menu: '任务属性配置'
      }, {
        path: 'sms',
        name: '短信模块维护',
        component: _import('attribute/sms'),
        meta: {title: '短信模块维护', icon: 'example'},
        menu: '短信模块维护'
      }, {
        path: 'mail',
        name: '通讯录',
        component: _import('attribute/mail'),
        meta: {title: '通讯录', icon: 'example'},
        menu: '通讯录'
      }, {
        path: 'file',
        name: '文件管理',
        component: _import('attribute/file'),
        meta: {title: '文件管理', icon: 'example'},
        menu: '文件管理'
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]
