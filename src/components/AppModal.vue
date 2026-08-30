<script setup lang="ts">
import { onBeforeUnmount, useTemplateRef, watch } from 'vue'

interface Props {
  open: boolean
  closeOnOverlay?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlay: true,
  ariaLabel: 'Диалоговое окно',
})

const emit = defineEmits<{
  close: []
}>()

const panel = useTemplateRef<HTMLElement>('panel')
let lastFocusedElement: HTMLElement | null = null

function close(): void {
  emit('close')
}

function handleOverlayClick(): void {
  if (props.closeOnOverlay) close()
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
}

// Наблюдатель управляет и ESC, и открытием/закрытием
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      lastFocusedElement = document.activeElement as HTMLElement | null
      window.addEventListener('keydown', handleKeydown)
      requestAnimationFrame(() => panel.value?.focus())
    } else {
      window.removeEventListener('keydown', handleKeydown)
      lastFocusedElement?.focus()
    }
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @click.self="handleOverlayClick">
        <div
          ref="panel"
          class="modal-panel"
          role="dialog"
          aria-modal="true"
          :aria-label="ariaLabel"
          tabindex="-1"
        >
          <button type="button" class="modal-panel__close" aria-label="Закрыть" @click="close">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                fill="none"
              />
            </svg>
          </button>

          <div class="modal-panel__content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  background: rgba(19, 24, 35, 0.48);
  backdrop-filter: blur(2px);
}

.modal-panel {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: min(640px, 85vh);
  overflow-y: auto;
  padding: var(--space-6) var(--space-5) var(--space-5);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-panel);

  &:focus {
    outline: none;
  }
}

.modal-panel__close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  color: var(--color-text-muted);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-bg);
    color: var(--color-text);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal-panel {
    transition: transform 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-panel {
    transform: scale(0.96) translateY(4px);
  }
}
</style>
