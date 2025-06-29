<script setup lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import UserWidget from '@/modules/user/UserWidget.vue'

const userStore = useUserStore()
const { isLoading, user } = storeToRefs(userStore)

userStore.fetchUser()
</script>

<template>
  <div>
    <UserWidget :loading="isLoading" :user="user" />
  </div>
</template>
