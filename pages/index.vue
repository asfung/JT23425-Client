<template>
    <div>
        <h1 class="text-red-500 underlined">Hello World</h1>
        <Button label="Verify" />
        <div class="card flex justify-center">
            <MultiSelect v-model="selectedCities" :options="cities" optionLabel="name" filter placeholder="Select Cities"
            :maxSelectedLabels="3" class="w-full md:w-80" />
        </div>

        <Rating v-model="value" />


    </div>
</template>

<script setup>
import MultiSelect from 'primevue/multiselect';
import Rating from 'primevue/rating';

import { ref } from "vue";

const value = ref(null);
const selectedCities = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

</script>

