import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/components/IndexPage'
import EquipmentSeletorTester from '@/components/embriomachine/EquipmentSeletorTester'
import MachineConstructPanel from '@/components/embriomachine/MachineConstructPanel'
import MachineList from '@/components/embriomachine/MachineList'
import EquipmentFilterConditionDialog from '@/components/embriomachine/EquipmentFilterConditionDialog'

//ie11対応
//see https://www.d-wood.com/blog/2016/04/12_7917.html
//see https://qiita.com/terrierscript/items/d2a9d5d4daedaacff924
import 'babel-polyfill'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage,
      meta : {
        title: 'エムブリオマシンサポートサイト'
      }
    },
    {
      path: '/embrioMachine/MachineList',
      name: 'MachineList',
      component: MachineList,
      meta : {
        title: 'エムブリオマシン 機体作成',
      }
    },
    {
      path: '/embrioMachine/MachineConstructPanel',
      name: 'MachineConstructPanel',
      component: MachineConstructPanel,
    },
    {
      path: '/embrioMachine/EquipmentFilterConditionDialog',
      name: 'EquipmentFilterConditionDialog',
      component: EquipmentFilterConditionDialog,
    },
    //for temporary.
    {
      path: '/embrioMachine/EquipmentSelector',
      name: 'EquipmentSeletorTester',
      title: 'test',
      component: EquipmentSeletorTester
    },
    { 
      path: '/embrioMachine/link/:id', 
      name: 'showMachine',
      component: MachineConstructPanel,
      props: { editMode: false }
    },
    { 
      path: '/embrioMachine/edit/:id', 
      name: 'editMachine',
      component: MachineConstructPanel,
      props: { editMode: true }
    },
    { 
      path: '/embrioMachine/create', 
      name: 'createMachine',
      component: MachineConstructPanel,
      props: { editMode: true }
    },
  ]
})
