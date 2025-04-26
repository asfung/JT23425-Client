<template>
  <div class="card flex justify-center items-center min-h-screen">
    <Form 
      :resolver="resolver" 
      @submit="onFormSubmit" 
      class="flex flex-col gap-4 w-full lg:w-[400px] sm:w-56 border-2 border-black dark:border-white rounded p-12">
      <h1 class="flex justify-center text-2xl font-bold opacity-70">Register</h1>

      <FormField v-slot="$field" as="section" name="name" initialValue="" class="flex flex-col gap-2">
        <InputText type="text" placeholder="Name" />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField v-slot="$field" as="section" name="email" initialValue="" class="flex flex-col gap-2">
        <InputText type="email" placeholder="Email" />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField v-slot="$field" asChild name="password" initialValue="">
        <section class="flex flex-col gap-2">
          <Password type="text" placeholder="Password" :feedback="false" toggleMask fluid />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </section>
      </FormField>

      <Button type="submit" severity="secondary" label="Register" />
      <p>already have have account? <span class="hover:underline hover:cursor-pointer text-green-400" @click="$router.push('/login')">login</span></p>
    </Form>
  </div>
</template>

<script setup>
useHead({
  title: 'Register'
})
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { Form, FormField } from '@primevue/forms'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Message from 'primevue/message'
import Button from 'primevue/button'

import { useAuthStore } from '~/stores/Auth'

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore()

const resolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: 'name is required ' }),
    email: z.string().min(1, { message: 'email is required' }).email({ message: 'invalid email format' }),
    password: z.string().min(8, { message: 'password must be at least 8 character' })
  })
);

const onFormSubmit = async ({ valid, states }) => {
  if (valid) {
    toast.add({ 
      severity: 'info', 
      summary: 'Registrasi Status', 
      detail: 'Harap Tunggu.....', 
      life: 0,
    })

    try {
      const payload = {
        name: states.name.value,
        email: states.email.value,
        password: states.password.value,
      }

      const response = await authStore.register(payload)

      if (response && response.status === 201) {
        toast.removeAllGroups()
        toast.add({ 
          severity: 'success', 
          summary: 'Registrasi Berhasil', 
          detail: 'Redirecting to login...', 
          life: 2000 
        })
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        toast.removeAllGroups()
        toast.add({
          severity: 'error',
          summary: 'Registrasi Gagal',
          detail: response.message,
          life: 3000
        })
      }

    } catch (error) {
      toast.removeAllGroups()
      toast.add({ 
        severity: 'error', 
        summary: 'Registrasi Gagal', 
        detail: error.message || 'Something went wrong', 
        life: 3000 
      })
    }
  }
};
</script>
