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
        <div class="flex items-center justify-between flex-wrap gap-4">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">Daftar Pegawai</span>
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
      <Column field="jabatan" header="Jabatan" headerClass="bg-gray-100"></Column>
      <Column field="tempat_tugas" header="Tempat Tugas" headerClass="bg-gray-100"></Column>
      <Column field="agama" header="Agama" headerClass="bg-gray-100"></Column>
      <Column field="no_hp" header="No HP" headerClass="bg-gray-100"></Column>
      <Column field="unit_kerja.name" header="Unit Kerja" headerClass="bg-gray-100"></Column>
      <Column header="Aksi" :style="{ width: '150px' }" headerClass="bg-gray-100">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-eye"
              class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600"
              @click="viewPegawai(data)"
              title="Lihat"
            />
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePegawaiStore } from '~/stores/Pegawai'; 
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const pegawai = ref([]);
const loading = ref(false);
const pegawaiStore = usePegawaiStore();
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

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
  const response = await pegawaiStore.getPegawai({ page, per_page: meta.value.per_page });
  if (response.status === 200) {
    pegawai.value = response.data;
    meta.value = response.response.data.meta;
  } else {
    console.error(response.message);
  }
  loading.value = false;
};

const onPage = (event) => {
  const newPage = event.page + 1;
  meta.value.per_page = event.rows
  fetchPegawai(newPage);
};

const viewPegawai = (data) => {
  console.log('View Pegawai:', data);
  alert(`Melihat data: ${data.nama}`);
};

const editPegawai = (data) => {
  console.log('Edit Pegawai:', data); 
  alert(`Mengedit data: ${data.nama}`);
};

const deletePegawai = async (data) => {
  if (confirm(`Apakah Anda yakin ingin menghapus ${data.nama}?`)) {
    console.log('Delete Pegawai:', data);
    alert(`Menghapus data: ${data.nama}`);
    await fetchPegawai(meta.value.current_page);
  }
};

// Initial fetch
onMounted(() => {
  fetchPegawai();
});
</script>