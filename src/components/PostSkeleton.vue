<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), {
  count: 3,
})
</script>

<template>
  <div class="post-skeleton-list" aria-hidden="true">
    <div v-for="n in count" :key="n" class="post-skeleton">
      <div class="post-skeleton__meta">
        <span class="post-skeleton__line post-skeleton__line--tag" />
        <span class="post-skeleton__line post-skeleton__line--author" />
      </div>
      <span class="post-skeleton__line post-skeleton__line--title" />
      <span class="post-skeleton__line post-skeleton__line--body" />
      <span class="post-skeleton__line post-skeleton__line--body-short" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-skeleton-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.post-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-border);
  border-radius: var(--radius-md);
}

.post-skeleton__meta {
  display: flex;
  gap: var(--space-3);
}

.post-skeleton__line {
  display: block;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    #eceef2 25%,
    #f5f6f8 50%,
    #eceef2 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;

  &--tag {
    width: 64px;
    height: 12px;
  }

  &--author {
    width: 72px;
    height: 12px;
  }

  &--title {
    width: 70%;
    height: 18px;
    margin-top: var(--space-1);
  }

  &--body {
    width: 100%;
    height: 14px;
  }

  &--body-short {
    width: 55%;
    height: 14px;
  }
}
</style>
