<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { usePosts } from '@/composables/usePosts'
import type { Post } from '@/types/post'

import PostCard from './PostCard.vue'
import PostSkeleton from './PostSkeleton.vue'

const emit = defineEmits<{
  'select-post': [post: Post]
}>()

const { posts, isLoading, isInitialLoading, hasMore, error, loadMore, retry } = usePosts()

const sentinel = useTemplateRef<HTMLElement>('sentinel')

// Наблюдатель отвечает за подгрузку. Внизу всегда висит элемент, который её запускает.
// При первом рендере он сразу виден — и первая страница грузится автоматом.
const observerDisabled = computed(() => isLoading.value || !hasMore.value || Boolean(error.value))

useInfiniteScroll(sentinel, loadMore, {
  disabled: observerDisabled,
  rootMargin: '240px',
})
</script>

<template>
  <div class="post-feed">
    <PostSkeleton v-if="isInitialLoading" :count="4" />

    <TransitionGroup v-else name="post-feed__item" tag="div" class="post-feed__list">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @select="emit('select-post', $event)"
      />
    </TransitionGroup>

    <PostSkeleton v-if="isLoading && !isInitialLoading" :count="2" />

    <p v-if="error" class="post-feed__status post-feed__status--error" role="alert">
      Ошибка загрузки
      <button type="button" class="post-feed__retry" @click="retry">Повторить</button>
    </p>

    <p v-else-if="!hasMore && !isInitialLoading" class="post-feed__status post-feed__status--end">
      Нет больше постов
    </p>

    <div ref="sentinel" class="post-feed__sentinel" />
  </div>
</template>

<style lang="scss" scoped>
.post-feed {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.post-feed__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.post-feed__item-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.post-feed__item-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.post-feed__sentinel {
  height: 1px;
}

.post-feed__status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  text-align: center;
}

.post-feed__status--end {
  color: var(--color-text-muted);
}

.post-feed__status--error {
  flex-direction: column;
  color: var(--color-danger);
  background: var(--color-danger-bg);
}

.post-feed__retry {
  padding: var(--space-2) var(--space-4);
  background: var(--color-danger);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
}
</style>
