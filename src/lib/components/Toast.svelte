<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    interface Props {
        message: string;
        type?: 'success' | 'error' | 'warning';
        show: boolean;
        onClose?: () => void;
    }

    let { message, type = 'success', show = $bindable(), onClose = () => {} }: Props = $props();

    let toastElement = $state<HTMLElement>();
    
    $effect(() => {
        if (show && toastElement) {
            const timer = setTimeout(() => {
                show = false;
                onClose();
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    });

    function closeToast() {
        show = false;
        onClose();
    }

    const typeStyles = {
        success: 'bg-green-600 border-green-500',
        error: 'bg-red-600 border-red-500', 
        warning: 'bg-yellow-600 border-yellow-500'
    };

    const typeIcons = {
        success: '✓',
        error: '❌',
        warning: '⚠️'
    };
</script>

{#if show}
    <div
        bind:this={toastElement}
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 min-w-80 max-w-md mx-4 {typeStyles[type]} text-white px-6 py-4 rounded-lg shadow-lg border-l-4 flex items-center gap-3"
        role="alert"
        in:fly={{ y: 100, duration: 400, easing: quintOut }}
        out:fly={{ y: 100, duration: 300, easing: quintOut }}
    >
        <span class="text-xl">{typeIcons[type]}</span>
        <span class="flex-1 text-sm font-medium">{message}</span>
        <button
            onclick={closeToast}
            class="text-white hover:text-gray-200 transition-colors ml-2"
            aria-label="Закрыть"
        >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
        </button>
    </div>
{/if}