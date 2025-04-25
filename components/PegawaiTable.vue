<template>
  <div class="shadow-md rounded-lg p-4">
    <DataTable
      :value="pegawai"
      :paginator="true"
      :rows="meta.per_page"
      :totalRecords="meta.total"
      :lazy="true"
      @page="onPage($event)"
      :rowsPerPageOptions="[5, 10, 20]"
      class="w-full"
      :sortOrder="1"
      :loading="loading"
      >
      <template #header>
        <div class="flex items-center justify-between flex-wrap gap-4 w-full">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">Daftar Pegawai</span>
          
          <div class="flex gap-2 items-center flex-wrap">
            <span class="p-input-icon-left">
              <!-- <i class="pi pi-search mr-2" /> -->
              <input
                v-model="search"
                type="text"
                placeholder="Cari pegawai..."
                class="p-inputtext p-component"
                @input="onSearch"
              />
            </span>

            <Button
              label="Tambah Pegawai"
              icon="pi pi-plus"
              class="bg-green-600 text-white hover:bg-green-700"
              @click="openDialog()"
            />

            <Button
              label="Export PDF"
              icon="pi pi-file-pdf"
              @click="handleExportPDF"
            />
          </div>
        </div>
      </template>
      <Column field="no" header="No" headerClass="bg-gray-100"></Column>
      <Column header="Profil" :style="{ width: '80px' }">
        <template #body="{ data }">
          <img
            :src="data.media ? $getImageUrl(data.media.path) : $randomProfileImage(data.nama)"
            :alt="data.nama"
            class="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        </template>
      </Column>
      <Column field="nip" header="NIP" headerClass="bg-gray-100"></Column>
      <Column field="nama" header="Nama" headerClass="bg-gray-100"></Column>
      <Column field="tempat_lahir" header="Tempat Lahir" headerClass="bg-gray-100"></Column>
      <Column field="tgl_lahir" header="Tanggal Lahir" headerClass="bg-gray-100">
        <template #body="{ data }">
          {{ formatDate(data.tgl_lahir) }}
        </template>
      </Column>
      <Column field="alamat" header="Alamat" headerClass="bg-gray-100"></Column>
      <Column field="jenis_kelamin" header="Jenis Kelamin" headerClass="bg-gray-100">
        <template #body="{ data }">
          {{ data.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki' }}
        </template>
      </Column>
      <Column field="unit_kerja.label" header="Unit Kerja" headerClass="bg-gray-100"></Column>
      <Column field="jabatan" header="Jabatan" headerClass="bg-gray-100"></Column>
      <Column field="tempat_tugas" header="Tempat Tugas" headerClass="bg-gray-100"></Column>
      <Column field="gol" header="Golongan" headerClass="bg-gray-100"></Column>
      <Column field="eselon" header="Eselon" headerClass="bg-gray-100"></Column>
      <Column field="agama" header="Agama" headerClass="bg-gray-100"></Column>
      <Column field="no_hp" header="No HP" headerClass="bg-gray-100"></Column>
      <!-- <Column field="unit_kerja.name" header="Unit Kerja" headerClass="bg-gray-100"></Column> -->
      <Column header="Action" :style="{ width: '150px' }" headerClass="bg-gray-100">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              severity="secondary"
              icon="pi pi-pencil"
              @click="editPegawai(data)"
              class="text-yellow-400"
              title="Edit">
              <template #icon>
                <i class="pi pi-pencil dark:text-white"></i> 
              </template>
            </Button>
            <Button
              severity="danger"
              icon="pi pi-trash"
              @click="deletePegawai($event, data)"
              title="Hapus">
              <template #icon>
                <i class="pi pi-trash dark:text-white"></i> 
              </template>
            </Button>
          </div>
        </template>
      </Column>
      <template #footer>
        <div class="text-gray-600">Total: {{ meta.total }} pegawai</div>
      </template>
    </DataTable>

    <PegawaiForm
      v-model="dialogVisible"
      :pegawaiData="selectedPegawai"
      @save="handleSave"
    />

    <ConfirmPopup></ConfirmPopup>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePegawaiStore } from '~/stores/Pegawai'
import { useDepartmentStore } from '~/stores/Department'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from "primevue/useconfirm";
import ConfirmPopup from 'primevue/confirmpopup';

const toast = useToast()
const confirm = useConfirm();
const pegawai = ref([]);
const loading = ref(false)
const pegawaiStore = usePegawaiStore()
const departmentStore = useDepartmentStore()
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

const dialogVisible = ref(false)
const selectedPegawai = ref({})

const search = ref('')
let searchTimeout = null

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const fetchPegawai = async (page = 1) => {
  loading.value = true;
  const params = {
    page,
    per_page: meta.value.per_page,
    search: search.value || '',
  }

  if (departmentStore.unitKerjaIdSelected) {
    params.unit_kerja_id = departmentStore.unitKerjaIdSelected
  }
  if (departmentStore.jabatanSelected) {
    params.jabatan = departmentStore.jabatanSelected
  }

  // console.log('fetchPegawai params:', params)
  const response = await pegawaiStore.getPegawai(params)
  if (response.status === 200) {
    pegawai.value = response.data
    meta.value = response.response.data.meta
  } else {
    pegawai.value = []
    console.error(response.message)
  }
  loading.value = false
};

const openDialog = (data = null) => {
  selectedPegawai.value = data ? { ...data } : {}
  dialogVisible.value = true
}


const onPage = (event) => {
  const newPage = event.page + 1
  meta.value.per_page = event.rows
  fetchPegawai(newPage)
}

const onSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchPegawai(1);
  }, 400)
}

const handleSave = async (formData) => {
  try {
    toast.add({
      severity: 'info',
      summary: formData.get('id') ? 'Update Pegawai Status' : 'Create Pegawai Status',
      detail: 'Harap Tunggu.....',
      life: 0,
    })
    let fetch;
    if (formData.get('id')) {
      fetch = await pegawaiStore.updatePegawai(formData, formData.get('id'));
    } else {
      fetch = await pegawaiStore.createPegawai(formData);
    }

    if (fetch.status === 200 || fetch.status === 201) {
      toast.removeAllGroups()
      toast.add({
        severity: 'success',
        summary: formData.get('id') ? 'Update Pegawai Success' : 'Create Pegawai Success',
        detail: fetch.message,
        life: 3000,
      });
    } else {
      throw new Error(fetch.message)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: formData.get('id') ? 'Update Pegawai Error' : 'Create Pegawai Error',
      detail: error.message,
      life: 3000,
    })
  }
  await fetchPegawai(meta.value.current_page)
}

const editPegawai = (data) => {
  openDialog(data)
}

const deletePegawai = async (event, data) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Ingin Menghapus Pegawai ini?',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: async () => {
      toast.add({
        severity: 'info',
        summary: 'Mengapus Pegawai Status',
        detail: 'Harap Tunggu.....',
        life: 0,
      })
      const fetch = await pegawaiStore.deletePegawai(data.id)
      if(fetch.status === 200){
        toast.removeAllGroups()
        toast.add({
          severity: 'error',
          summary: `Mengapus Pegawai Berhasil`,
          detail: `Menghapus ${data.nama}`,
          life: 4000,
        });
        await fetchPegawai(meta.value.current_page)
      }
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Menghapus Pegawai Status', detail: 'Batal Menghapus Pegawai', life: 3000 })
    }
  })

}

const handleExportPDF = async () => {
  toast.add({
    severity: 'info',
    summary: 'PDF Status',
    detail: 'Harap Tunggu.....',
    life: 0,
  })
  const response = await pegawaiStore.exportPegawaiPdf({
    page: meta.value.current_page,
    per_page: meta.value.per_page,
    search: search.value,
    unit_kerja_id: departmentStore.unitKerjaIdSelected,
    jabatan: departmentStore.jabatanSelected,
  })

  if (response.status === 200) {
    toast.removeAllGroups()
    toast.add({
      severity: 'success',
      summary: 'PDF Status',
      detail: 'PDF Ready....',
      life: 4000,
    })
    const blob = response.data
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `pegawai.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } else {
    toast.add({
      severity: 'error',
      summary: 'Export PDF Gagal',
      detail: response.message,
      life: 3000,
    })
  }
}


watch(
  () => [departmentStore.unitKerjaIdSelected, departmentStore.jabatanSelected],
  (newVal, oldVal) => {
    fetchPegawai(1)
  }
);

onMounted(() => {
  fetchPegawai()
})
</script>