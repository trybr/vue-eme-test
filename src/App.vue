<script setup lang="ts">
import { ref } from 'vue'

import AppModal from '@/components/AppModal.vue'
import PostFeed from '@/components/PostFeed.vue'
import type { Post } from '@/types/post'

const isModalOpen = ref(false)
const selectedPost = ref<Post | null>(null)

function openPost(post: Post): void {
  selectedPost.value = post
  isModalOpen.value = true
}

function closeModal(): void {
  isModalOpen.value = false
}
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__title">Бесконечная лента постов и модальные окна</h1>
      <p class="app__subtitle">
        1. Загрузка постов происходит через JSONPlaceholder. <br />
        2. Клик по посту открывает детали поста. <br />
      </p>
    </header>

    <main class="app__main">
      <PostFeed @select-post="openPost" />
    </main>

    <AppModal :open="isModalOpen" ariaLabel="Просмотр поста" @close="closeModal">
      <article v-if="selectedPost" class="post-detail">
        <span class="post-detail__tag">#{{ String(selectedPost.id).padStart(6, '0') }}</span>
        <h2 class="post-detail__title">{{ selectedPost.title }}</h2>
        <p class="post-detail__body">{{ selectedPost.body }}</p>
        <p class="post-detail__author">Автор: пользователь U{{ selectedPost.userId }}</p>
      </article>
    </AppModal>
  </div>
</template>

<style lang="scss" scoped>
.app {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4) var(--space-6);
}

.app__header {
  margin-bottom: var(--space-5);
}

.app__title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.app__subtitle {
  margin-top: var(--space-1);
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}

.post-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.post-detail__tag {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-accent);
}

.post-detail__title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.35;
  text-transform: capitalize;
}

.post-detail__body {
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.6;
}

.post-detail__author {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
