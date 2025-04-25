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
          </div>
        </div>
      </template>
      <Column field="no" header="No" headerClass="bg-gray-100"></Column>
      <Column header="Profil" :style="{ width: '80px' }">
        <template #body="{ data }">
          <img
            :src="data.media ? data.media.url : $randomProfileImage(data.nama)"
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
      <Column field="agama" header="Agama" headerClass="bg-gray-100"></Column>
      <Column field="no_hp" header="No HP" headerClass="bg-gray-100"></Column>
      <!-- <Column field="unit_kerja.name" header="Unit Kerja" headerClass="bg-gray-100"></Column> -->
      <Column header="Action" :style="{ width: '150px' }" headerClass="bg-gray-100">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-pencil"
              class="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-600"
              @click="editPegawai(data)"
              title="Edit"
            />
            <Button
              icon="pi pi-trash"
              class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              @click="deletePegawai(data)"
              title="Hapus"
            />
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

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { usePegawaiStore } from '~/stores/Pegawai'; 
import { useDepartmentStore } from '~/stores/Department';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';


const { $pegawaiImageFetch } = useNuxtApp();
const imageSrc = ref({});

const pegawai = ref([]);
const loading = ref(false);
const pegawaiStore = usePegawaiStore();
const departmentStore = useDepartmentStore();
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

const dialogVisible = ref(false);
const selectedPegawai = ref({});

const search = ref('');
let searchTimeout = null;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const fetchPegawai = async (page = 1) => {
  loading.value = true;
  const params = {
    page,
    per_page: meta.value.per_page,
    search: search.value || '',
  };

  if (departmentStore.unitKerjaIdSelected) {
    params.unit_kerja_id = departmentStore.unitKerjaIdSelected;
  }
  if (departmentStore.jabatanSelected) {
    params.jabatan = departmentStore.jabatanSelected;
  }

  console.log('fetchPegawai params:', params); 
  const response = await pegawaiStore.getPegawai(params);
  if (response.status === 200) {
    pegawai.value = response.data;
    meta.value = response.response.data.meta;
  } else {
    pegawai.value = [];
    console.error(response.message);
  }
  loading.value = false;
};

const openDialog = (data = null) => {
  selectedPegawai.value = data ? { ...data } : {};
  dialogVisible.value = true;
};


const onPage = (event) => {
  const newPage = event.page + 1;
  meta.value.per_page = event.rows
  fetchPegawai(newPage);
};

const onSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchPegawai(1);
  }, 400); 
};

const handleSave = async (form) => {
  if (form.id) {
    console.log(form)
    // await pegawaiStore.updatePegawai(form.id, form);
    alert('data berhasil diperbarui.');
  } else {
    console.log(form)
    // await pegawaiStore.createPegawai(form);
    alert('data berhasil ditambahkan.');
  }
  await fetchPegawai(meta.value.current_page);
};

const editPegawai = (data) => {
  console.log('pegawai edit: ', data); 
  openDialog(data);
};

const deletePegawai = async (data) => {
  if (confirm(`Apakah Anda yakin ingin menghapus ${data.nama}?`)) {
    console.log('Delete Pegawai:', data);
    alert(`Menghapus data: ${data.nama}`);
    await fetchPegawai(meta.value.current_page);
  }
};

watch(
  () => [departmentStore.unitKerjaIdSelected, departmentStore.jabatanSelected],
  (newVal, oldVal) => {
    fetchPegawai(1); 
  }
);

watchEffect(() => {
  pegawai.value.forEach(async (p) => {
    if (!imageSrc.value[p.id]) {
      const url = await $pegawaiImageFetch(p.id, p.nama);
      imageSrc.value[p.id] = url;
    }
  });
})

onMounted(() => {
  fetchPegawai();
});
</script>