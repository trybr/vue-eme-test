import { computed, ref, shallowRef } from 'vue'

import { fetchPostsPage } from '@/api/posts'
import type { Post } from '@/types/post'

const PAGE_SIZE = 10

export function usePosts() {
  const posts = shallowRef<Post[]>([])
  const nextPage = ref(1)
  const isLoading = ref(false)
  const isInitialLoading = ref(true)
  const hasMore = ref(true)
  const error = ref<string | null>(null)

  let activeRequest: AbortController | null = null

  async function loadMore(): Promise<void> {
    if (isLoading.value || !hasMore.value) return

    activeRequest?.abort()
    const request = new AbortController()
    activeRequest = request

    isLoading.value = true
    error.value = null

    try {
      const page = await fetchPostsPage(nextPage.value, PAGE_SIZE, request.signal)
      posts.value = [...posts.value, ...page.posts]
      hasMore.value = page.hasMore
      nextPage.value += 1
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return
      error.value =
        caught instanceof Error ? caught.message : 'Не удалось загрузить посты'
    } finally {
      isLoading.value = false
      isInitialLoading.value = false
    }
  }

  function retry(): void {
    error.value = null
    void loadMore()
  }

  return {
    posts: computed(() => posts.value),
    isLoading: computed(() => isLoading.value),
    isInitialLoading: computed(() => isInitialLoading.value),
    hasMore: computed(() => hasMore.value),
    error: computed(() => error.value),
    loadMore,
    retry,
  }
}
