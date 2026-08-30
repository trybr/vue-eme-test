import type { Post, PostsPage } from '@/types/post'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

/**
 *
 * Загружает страницу постов с JSONPlaceholder.
 *
 * В JSONPlaceholder 100 постов, пагинация — через _page и _limit.
 */
export async function fetchPostsPage(
  page: number,
  limit: number,
  signal?: AbortSignal,
): Promise<PostsPage> {
  const url = new URL(`${API_BASE_URL}/posts`)
  url.searchParams.set('_page', String(page))
  url.searchParams.set('_limit', String(limit))

  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`Failed to load posts: ${response.status} ${response.statusText}`)
  }

  const posts = (await response.json()) as Post[]

  return {
    posts,
    hasMore: posts.length === limit,
  }
}
