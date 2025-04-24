<template>
  <Tree 
    :value="treeData" 
    :filter="true" 
    selectionMode="single"
    v-model:selectionKeys="selectedKeys"
    v-model:expandedKeys="expandedKeys"
    @node-select="onNodeSelect"
    @node-unselect="onNodeUnselect"
  />
</template>

<script setup>
import Tree from 'primevue/tree';
import { ref, onMounted } from 'vue'
import { useDepartmentStore } from '~/stores/Department'

const treeData = ref([])
const selectedKeys = ref({})
const expandedKeys = ref({})
// const selectedKeys = ref({ 'root-pegawai': true });
const departmentStore = useDepartmentStore()

const fetchDepartmentTree = async () => {
  const fetch = await departmentStore.getTreeUnitKerja()
  const units = fetch.data

  const buildTree = (nodes) => {
    return nodes.map((node) => ({
      key: `unit-${node.id}`,
      label: node.name,
      data: node,
      children: [
        ...node.children ? buildTree(node.children) : [],
        ...node.jabatans.map(j => ({
          key: `jabatan-${j.id}`,
          label: j.name,
          icon: 'pi pi-user',
          data: j,
          expanded: true,
        }))
      ]
    }))
  }
  // treeData.value = buildTree(units)
  treeData.value = [
    {
      key: 'root-pegawai',
      label: 'Pegawai',
      expanded: true,
      children: buildTree(units)
    }
  ]
  selectedKeys.value = { 'root-pegawai': true };
  expandedKeys.value = { 'root-pegawai': true }; 
}

const onNodeSelect = (event) => {
  console.log('Node selected:', event.node);
  console.log(event)
};

const onNodeUnselect = (event) => {
  if (event.node.key === 'root-pegawai') {
    selectedKeys.value = { 'root-pegawai': true };
  }
};

// watch(selectedKeys, (newValue) => {
//   if (!newValue['root-pegawai'] && Object.keys(newValue).length === 0) {
//     selectedKeys.value = { 'root-pegawai': true };
//   }
// }, { deep: true });

onMounted(() => {
  fetchDepartmentTree()
})
</script>