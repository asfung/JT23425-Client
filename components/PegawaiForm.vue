<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="form.id ? 'Edit Pegawai' : 'Tambah Pegawai'"
    :closable="true"
    :style="{ width: '600px' }"
  >
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col col-span-2">
        <label for="file">Upload File</label>
        <div v-if="form.id" class="mb-2">
          <img
            :src="filePreviewUrl"
            alt="Preview"
            class="w-32 h-32 object-cover rounded shadow"
          />
        </div>

        <FileUpload 
          name="file" 
          accept="image/*" 
          :maxFileSize="1000000" 
          :auto="true" 
          :chooseLabel="'Pilih File'"
          :uploadLabel="'Upload'"
          :cancelLabel="'Batal'"
          mode="basic"
          @select="onFileSelect"
        />
      </div>
      <div class="flex flex-col">
        <label for="nip">NIP</label>
        <InputText v-model="form.nip" id="nip" />
        <small v-if="errors.nip" class="text-red-500">{{ errors.nip }}</small>
      </div>
      <div class="flex flex-col">
        <label for="nama">Nama</label>
        <InputText v-model="form.nama" id="nama" />
        <small v-if="errors.nama" class="text-red-500">{{ errors.nama }}</small>
      </div>
      <div class="flex flex-col">
        <label for="tempat_lahir">Tempat Lahir</label>
        <AutoComplete
          v-model="form.tempat_lahir"
          :suggestions="filteredTempatLahir"
          optionLabel="name"
          completeOnFocus
          dropdown
          @complete="searchTempatLahir"
          inputId="tempat_lahir"
          placeholder="Cari kota"
        />
        <small v-if="errors.tempat_lahir" class="text-red-500">{{ errors.tempat_lahir }}</small>
      </div>
      <div class="flex flex-col">
        <label for="tgl_lahir">Tanggal Lahir</label>
        <DatePicker v-model="form.tgl_lahir" inputId="tgl_lahir" dateFormat="yy-mm-dd" showIcon />
        <small v-if="errors.tgl_lahir" class="text-red-500">{{ errors.tgl_lahir }}</small>
      </div>
      <div class="flex flex-col col-span-2">
        <label for="alamat">Alamat</label>
        <InputText v-model="form.alamat" id="alamat" />
      </div>

      <div class="flex flex-col">
        <label>Jenis Kelamin</label>
        <div class="flex gap-4 mt-1">
          <div class="flex items-center gap-2">
            <RadioButton inputId="jk-l" v-model="form.jenis_kelamin" name="jk" value="L" />
            <label for="jk-l">Laki-laki</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton inputId="jk-p" v-model="form.jenis_kelamin" name="jk" value="P" />
            <label for="jk-p">Perempuan</label>
          </div>
        </div>
        <small v-if="errors.jenis_kelamin" class="text-red-500">{{ errors.jenis_kelamin }}</small>
      </div>

      <div class="flex flex-col">
        <label for="gol">Golongan</label>
        <Select v-model="form.gol" :options="golonganList" optionLabel="name" optionValue="name" placeholder="Pilih Golongan" inputId="gol" />
      </div>

      <div class="flex flex-col">
        <label for="eselon">Eselon</label>
        <Select v-model="form.eselon" :options="eselonList" optionLabel="name" optionValue="name" placeholder="Pilih Eselon" inputId="eselon" />
      </div>

      <div class="flex flex-col col-span-2">
        <label for="unit_kerja_id">Unit Kerja</label>
        <Select v-model="form.unit_kerja_id" :options="unitKerjaList" optionLabel="label" optionValue="id" placeholder="Pilih Unit Kerja" inputId="unit_kerja_id" @change="onUnitKerjaChange" />
        <small v-if="errors.unit_kerja_id" class="text-red-500">{{ errors.unit_kerja_id }}</small>
      </div>

      <div class="flex flex-col col-span-2">
        <label for="jabatan">Jabatan</label>
        <Select
          v-model="form.jabatan"
          :options="jabatanList"
          optionLabel="name"
          optionValue="name"
          placeholder="Pilih Jabatan"
          inputId="jabatan"
          :disabled="!form.jabatan && jabatanList.length === 0"
        />
        <small v-if="errors.jabatan" class="text-red-500">{{ errors.jabatan }}</small>
      </div>

      <div class="flex flex-col">
        <label for="tempat_tugas">Tempat Tugas</label>
        <AutoComplete
          v-model="form.tempat_tugas"
          :suggestions="filteredTempatTugas"
          optionLabel="name"
          completeOnFocus
          dropdown
          @complete="searchTempatTugas"
          inputId="tempat_tugas"
          placeholder="Cari kota"
        />
      </div>

      <div class="flex flex-col">
        <label for="agama">Agama</label>
        <Select v-model="form.agama" :options="agamaList" optionLabel="name" optionValue="name" placeholder="Pilih Agama" inputId="agama" />
      </div>

      <div class="flex flex-col">
        <label for="no_hp">No HP</label>
        <InputText v-model="form.no_hp" id="no_hp" />
      </div>
      <div class="flex flex-col">
        <label for="npwp">NPWP</label>
        <InputText v-model="form.npwp" id="npwp" />
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <Button label="Batal" class="p-button-text" @click="close" />
      <Button :label="form.id ? 'Update' : 'Simpan'" class="bg-blue-600 text-white hover:bg-blue-700" @click="submit" />
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import AutoComplete from 'primevue/autocomplete';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import RadioButton from 'primevue/radiobutton';
import FileUpload from 'primevue/fileupload'; 
import { useFormOptions } from '~/composables/useFormOptions';

const props = defineProps({
  modelValue: Boolean,
  pegawaiData: {
    type: Object,
    default: () => ({}),
  },
});
const errors = ref({});

const emit = defineEmits(['update:modelValue', 'save']);
const visible = ref(props.modelValue);

watch(() => props.modelValue, val => (visible.value = val));
watch(visible, val => emit('update:modelValue', val));

const form = ref({ ...props.pegawaiData, file: null });

watch(() => props.pegawaiData, async (val) => {
  form.value = { ...val, file: val.file?? null };
  if (val.unit_kerja_id) {
    await getJabatanByUnitKerjaFetch(val.unit_kerja_id);
  }
});

const filePreviewUrl = computed(() => {
  const { $randomProfileImage, $getImageUrl } = useNuxtApp()
  const media = form.value.media;

  if (media?.path?.startsWith('blob:')) {
    return media.path;
  }

  if (media?.path) {
    return $getImageUrl(media.path);
  }

  return $randomProfileImage(form.value.nama);
});
  // return form.value.media ? $getImageUrl(form.value.media.path) : $randomProfileImage(form.value.nama)

const {
  getGolongan,
  getEselon,
  getAgama,
  getUnitKerja,
  getJabatanByUnitKerja,
  searchCities
} = useFormOptions();

const unitKerjaList = ref([]);
const jabatanList = ref([]);
const golonganList = ref([]);
const eselonList = ref([]);
const agamaList = ref([]);
const citiesList = ref([]);

const filteredTempatLahir = ref([]);
const filteredTempatTugas = ref([]);

const fetchFormOptions = async () => {
  const [gol, es, agm, unit, cities] = await Promise.all([
    getGolongan(),
    getEselon(),
    getAgama(),
    getUnitKerja(),
    searchCities('')
  ]);

  if (gol.status === 200) golonganList.value = gol.data;
  if (es.status === 200) eselonList.value = es.data;
  if (agm.status === 200) agamaList.value = agm.data;
  if (unit.status === 200) unitKerjaList.value = unit.data;
  if (cities.status === 200) citiesList.value = cities.data;
};

const getJabatanByUnitKerjaFetch = async (id) => {
  const response = await getJabatanByUnitKerja(id);
  if (response.status === 200) {
    jabatanList.value = response.data;
  }
};

const onUnitKerjaChange = async () => {
  form.value.jabatan = '';
  if (form.value.unit_kerja_id) {
    await getJabatanByUnitKerjaFetch(form.value.unit_kerja_id);
  } else {
    jabatanList.value = [];
  }
};

const onFileSelect = (event) => {
  const selectedFile = event.files?.[0] || null;
  form.value.file = selectedFile;
  if (selectedFile) {
    form.value.media = {
      path: URL.createObjectURL(selectedFile)
    };
  }
};

const searchTempatLahir = async ({ query }) => {
  const response = await searchCities(query);
  if (response.status === 200) {
    filteredTempatLahir.value = response.data;
  }
};

const searchTempatTugas = async ({ query }) => {
  const response = await searchCities(query);
  if (response.status === 200) {
    filteredTempatTugas.value = response.data;
  }
};

const close = () => {
  visible.value = false;
};

const submit = () => {
  if (!validateForm()) return;
  const payload = {
    ...form.value,
    tempat_lahir: form.value.tempat_lahir?.name || '',
    tempat_tugas: form.value.tempat_tugas?.name || '',
    file: form.value.file,  
  };

  emit('save', payload);
  visible.value = false;
};

onMounted(() => {
  fetchFormOptions();
});


const validateForm = () => {
  errors.value = {};

  if (!form.value.nip) errors.value.nip = 'NIP wajib diisi.';
  if (!form.value.nama) errors.value.nama = 'Nama wajib diisi.';
  if (!form.value.tempat_lahir?.name) errors.value.tempat_lahir = 'Tempat lahir wajib diisi.';
  if (!form.value.tgl_lahir) errors.value.tgl_lahir = 'Tanggal lahir wajib diisi.';
  if (!form.value.jenis_kelamin || !['L', 'P'].includes(form.value.jenis_kelamin)) {
    errors.value.jenis_kelamin = 'Jenis kelamin wajib dipilih.';
  }
  if (!form.value.jabatan) errors.value.jabatan = 'Jabatan wajib diisi.';
  if (!form.value.unit_kerja_id) errors.value.unit_kerja_id = 'Unit Kerja wajib dipilih.';

  const file = form.value.file;
  if (file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      errors.value.file = 'File harus berupa gambar dengan format jpg, png, jpeg, gif, atau svg.';
    }
    if (file.size > 2048 * 1024) {
      errors.value.file = 'Ukuran file maksimal 2MB.';
    }
  }

  return Object.keys(errors.value).length === 0;
};

</script>
