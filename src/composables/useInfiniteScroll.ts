import { onMounted, onUnmounted, watch } from 'vue'

// Минимальная read-only ref-совместимость
interface RefLike<T> {
  readonly value: T
}

interface UseInfiniteScrollOptions {
  disabled?: RefLike<boolean>
  root?: RefLike<Element | null | undefined>
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * Вызывает `callback`, когда `target` появляется на экране (и не `disabled`).
 * Переподписка при каждом изменении позволяет отработать мгновенно, если элемент
 * уже виден, но был выключен. Нужно для автоподгрузки, пока есть контент и страницы.
 */
export function useInfiniteScroll(
  target: RefLike<Element | null | undefined>,
  callback: () => void,
  options: UseInfiniteScrollOptions = {},
): void {
  let observer: IntersectionObserver | null = null

  const teardown = () => {
    observer?.disconnect()
    observer = null
  }

  const setup = () => {
    teardown()

    if (!target.value || options.disabled?.value) return

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callback()
      },
      {
        root: options.root?.value ?? null,
        rootMargin: options.rootMargin ?? '200px',
        threshold: options.threshold ?? 0,
      },
    )

    observer.observe(target.value)
  }

  onMounted(setup)
  onUnmounted(teardown)

  watch([() => target.value, () => options.disabled?.value], setup)
}
