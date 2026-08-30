/**
 * Пост, который возвращает JSONPlaceholder.
 * https://jsonplaceholder.typicode.com/posts
 */
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

/** Результат загрузки одной страницы + флаг, есть ли ещё посты. */
export interface PostsPage {
  posts: Post[]
  hasMore: boolean
}
