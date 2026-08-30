<script setup lang="ts">
import { computed } from 'vue'

import type { Post } from '@/types/post'

const props = defineProps<{ post: Post }>()

const emit = defineEmits<{
  select: [post: Post]
}>()

// Цветовая схема для пользователей (по userId).
const USER_COLORS = ['#0e9488', '#5b6ee1', '#c2534f', '#4f8a3d', '#8a5fd1', '#c2872f']

const accentColor = computed(() => USER_COLORS[(props.post.userId - 1) % USER_COLORS.length])

const postNumber = computed(() => `#${String(props.post.id).padStart(6, '0')}`)

function select() {
  emit('select', props.post)
}
</script>

<template>
  <article
    class="post-card"
    :style="{ '--accent': accentColor }"
    tabindex="0"
    role="button"
    :aria-label="`Открыть пост ${postNumber}`"
    @click="select"
    @keydown.enter="select"
    @keydown.space.prevent="select"
  >
    <div class="post-card__meta">
      <span class="post-card__tag">{{ postNumber }}</span>
      <span class="post-card__author">автор U{{ post.userId }}</span>
    </div>
    <h2 class="post-card__title">{{ post.title }}</h2>
    <p class="post-card__body">{{ post.body }}</p>
  </article>
</template>

<style lang="scss" scoped>
.post-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--accent, var(--color-accent));
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 24, 40, 0.08);
  }

  &:active {
    transform: translateY(0);
  }
}

.post-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.post-card__tag {
  color: var(--accent, var(--color-accent));
  font-weight: 600;
  letter-spacing: 0.02em;
}

.post-card__author {
  color: var(--color-text-muted);
}

.post-card__title {
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.35;
  text-transform: capitalize;
}

.post-card__body {
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
