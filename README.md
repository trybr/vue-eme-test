# Лента постов — Infinite Scroll + Modal

Тестовое задание: Vue 3 (Composition API) + TypeScript + SCSS + Vite.

Автор: Бородин Дмитрий

## ДЕМО

[Демо](https://github.com/borodin-dmitry/vue-test-eme)

## Запуск

```bash
npm install
npm run dev       # http://localhost:5173 запуск на локалхосте
npm run build     # production-сборка в dist/
npm run preview   # локальный просмотр production-сборки
```

## Что реализовано

### 1. Infinite scroll лента (`src/components/PostFeed.vue`)

- Данные — `GET https://jsonplaceholder.typicode.com/posts?_page=N&_limit=10`.
- Загрузка следующей страницы триггерится через **Intersection Observer**,
  наблюдающий за невидимым сентинел-элементом в конце списка
  (`src/composables/useInfiniteScroll.ts` — переиспользуемый composable,
  не завязанный на посты).
- Состояние пагинации (страница, `hasMore`, ошибки, загрузка) вынесено в
  `src/composables/usePosts.ts`.
- Скелетон-заглушки (`PostSkeleton.vue`) показываются и при первой загрузке,
  и при подгрузке следующих страниц.
- Индикатор "Нет больше постов", когда API вернул страницу короче лимита.
- Отдельное состояние ошибки сети с кнопкой «Повторить» (запрос через
  `fetch`, отменяемые через `AbortController` при повторных вызовах).

### 2. Модальное окно (`src/components/AppModal.vue`)

- Переиспользуемый компонент с **slot** для произвольного контента.
- Рендерится через **`<Teleport to="body">`**.
- Закрытие по клику на оверлей (`@click.self`, чтобы клики внутри панели
  не закрывали модалку) и по **Escape**.
- Базовое управление фокусом: при открытии фокус уходит на панель,
  при закрытии — возвращается на элемент, с которого модалка была открыта.

## Структура

```
src/
  api/posts.ts               — HTTP-клиент JSONPlaceholder
  types/post.ts              — типы Post / PostsPage
  composables/
    useInfiniteScroll.ts     — обёртка над IntersectionObserver
    usePosts.ts              — состояние пагинации ленты
  components/
    PostCard.vue             — Карточка поста
    PostSkeleton.vue         — Скелетон-заглушка
    PostFeed.vue             — Лента постов
    AppModal.vue             — Модальное окно
  styles/main.scss           — CSS custom properties, reset, keyframes
  App.vue
  main.ts
```

## Заметки по реализации

- Дизайн-токены (цвета, отступы, радиусы, тени) вынесены в CSS custom
  properties в `styles/main.scss` — компоненты используют `var(--...)`
  в scoped SCSS без дополнительных `@use`/импортов.
- `useInfiniteScroll` пересоздаёт наблюдатель при каждом релевантном
  изменении (target/disabled), поэтому callback срабатывает и в момент,
  когда сентинел уже во вьюпорте, а `disabled` становится `false` — это
  естественным образом продолжает подгрузку, пока контент не заполнит
  экран, без отдельного «ручного» первого вызова.
