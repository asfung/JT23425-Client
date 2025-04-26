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
import Tree from 'primevue/tree'
import { useDepartmentStore } from '~/stores/Department'
import { useToast } from 'primevue/usetoast'

const treeData = ref([]);
// const selectedKeys = ref({ 'root-pegawai': true })
const selectedKeys = ref({})
const expandedKeys = ref({ 'root-pegawai': true })
const departmentStore = useDepartmentStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const fetchDepartmentTree = async () => {
  try {
    const fetch = await departmentStore.getTreeUnitKerja()

    if (fetch.status !== 200) {
      toast.add({
        severity: 'error',
        summary: 'Department Tree',
        detail: fetch.message,
        life: 3000,
      })
      return;
    }

    const units = fetch.data;

    const buildTree = (nodes) => {
      return nodes.map((node) => ({
        key: `unit-${node.id}`,
        label: node.name,
        data: node,
        children: [
          ...(node.children ? buildTree(node.children) : []),
          ...node.jabatans.map((j) => ({
            key: `jabatan-${j.id}`,
            label: j.name,
            // icon: 'pi pi-user',
            data: j,
          })),
        ],
      }))
    }

    treeData.value = [
      {
        key: 'root-pegawai',
        label: 'Pegawai',
        children: buildTree(units),
      },
    ]

    if (route.path !== '/') {
      selectedKeys.value = null
    } else {
      selectedKeys.value = { 'root-pegawai': true }
    }

  } catch (e) {
    console.error(e)
  }
}

const onNodeSelect = (event) => {
  if (!event) return
  if (route.path !== '/') {
    router.push('/')
  }
  departmentStore.setSelectedNode(event)
};

const onNodeUnselect = (event) => {
  if (!event) return
  if (event.key === 'root-pegawai') {
    selectedKeys.value = { 'root-pegawai': true }
    departmentStore.clearSelection()
  } else {
    departmentStore.clearSelection()
  }
}

onMounted(() => {
  fetchDepartmentTree()
})
</script>