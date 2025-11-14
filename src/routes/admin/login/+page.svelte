<script lang="ts">
  import { enhance } from '$app/forms';
  
  let { form } = $props<{ form?: any }>();
  let token = $state('');
</script>

<section class="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
        Вход в админку
      </h2>
    </div>
    <form class="mt-8 space-y-6" method="POST" use:enhance>
      <div>
        <label for="token" class="sr-only">Пароль</label>
        <input
          id="token"
          name="token"
          type="password"
          required
          bind:value={token}
          class="form-input-base"
          placeholder="Введите пароль"
        />
      </div>

      {#if form?.error}
        <div class="text-red-400 text-sm text-center">
          {form.error}
        </div>
      {/if}

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Войти
        </button>
      </div>
    </form>
  </div>
</section>