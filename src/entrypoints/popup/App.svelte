<script lang="ts">
  import { store } from '../../lib/storage'
</script>

<main class="p-4 min-w-40 min-h-30">
  <p>zyBookers</p>

  <div class="card">
    <Counter />
  </div>
</main>

<style>
  :global(body) {
    @apply bg-zinc-900 text-white min-h-32 min-w-64;
  }
</style>
