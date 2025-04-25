<template>
  <div class="card flex justify-center items-center min-h-screen">
    <Form 
      :resolver="resolver" 
      @submit="onFormSubmit" 
      class="flex flex-col gap-4 w-full lg:w-[400px] sm:w-56 border-2 border-green-400 rounded p-12">
      <FormField v-slot="$field" as="section" name="email" initialValue="admin@gmail.com" class="flex flex-col gap-2">
        <InputText type="email" placeholder="Email" />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
        </Message>
      </FormField>
      <FormField v-slot="$field" asChild name="password" initialValue="">
        <section class="flex flex-col gap-2">
          <Password type="text" placeholder="Password" :feedback="false" toggleMask fluid />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}
          </Message>
        </section>
      </FormField>
      <Button type="submit" severity="secondary" label="Submit" />
    </Form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
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
    email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Harus Berupa Email' }),
    password: z.string().min(1, { message: 'Password Harus Diisi.' })
  })
);

const onFormSubmit = async ({ valid, states }) => {
  if (valid) {
    toast.add({ 
      severity: 'info', 
      summary: 'Logging in...', 
      detail: 'Harap Tunggu', 
      life: 0,
    })

    try {
      const email = states.email.value
      const password = states.password.value
      const payload = { email: email, password: password }
      
      const response = await authStore.login(payload)
      
      if(response && response.status === 200){
        toast.removeAllGroups()
        console.log(response)
        const token = response.data.authorization.token
        authStore.setToken(token)
        toast.add({ 
          severity: 'success', 
          summary: 'Login Successful', 
          detail: 'Redirecting...', 
          life: 2000 
        })
        setTimeout(() => {
          // useNuxtApp().$router.push('/');
          window.location.href = '/'
        }, 2000)
      }else{
        toast.removeAllGroups()
        toast.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: response.message,
          life: 3000
        })
      }

    } catch (error) {
      toast.removeAllGroups()
      toast.add({ 
        severity: 'error', 
        summary: 'Login Failed', 
        detail: error.message || 'Invalid credentials', 
        life: 3000 
      })
    }
  }
};
</script>