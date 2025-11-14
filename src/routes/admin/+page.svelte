<script lang="ts">
  
  let { data } = $props<{ data: any }>();

  const rows = data.registrations ?? [];
  let deletingId = $state<number | null>(null);

  async function confirmDelete(id: number, teamName: string) {
    if (confirm(`Вы уверены, что хотите удалить заявку команды "${teamName}"?`)) {
      deletingId = id;
      
      try {
        const formData = new FormData();
        formData.append('registrationId', id.toString());
        
        const response = await fetch('?/deleteRegistration', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          location.reload();
        } else {
          alert('Ошибка при удалении заявки');
        }
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Ошибка при удалении заявки');
      } finally {
        deletingId = null;
      }
    }
  }

  function downloadCSV() {
    const headers = ['ID', 'Дата создания', 'Лидер команды', 'Название команды', 'Кейс', 'Телефон', 'Email', 'Организация', 'Количество участников', 'Участники'];
    
    const csvData = rows.map((row: any) => [
      row.id,
      row.createdAt ? new Date(row.createdAt).toLocaleString('ru-RU') : '',
      row.leaderFio,
      row.teamName,
      `Кейс ${row.caseNumber || 1}`,
      row.phone,
      row.email,
      row.organization,
      row.membersCount || row.membersFio.split(',').length,
      row.membersFio.replace(/\n/g, ' | ') 
    ]);

    const csv = [headers, ...csvData]
      .map(row => row.map((field: any) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<section class="p-default py-10">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-4xl font-bold text-white">Админка — Регистрации</h1>
      <div class="mt-2 text-sm text-gray-400">
  Участников: <span class="font-bold text-white">{data.totalParticipants} / 60</span>
  | Команд: <span class="font-bold text-white">{Math.floor(data.totalParticipants / 5)} / 12</span>
  | Осталось мест: <span class="font-bold {data.remainingSlots >= 5 ? 'text-green-400' : 'text-red-400'}">{data.remainingSlots}</span>
      </div>
    </div>
    {#if rows.length > 0}
      <button 
        onclick={downloadCSV}
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http:
          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Скачать CSV
      </button>
    {/if}
  </div>

  {#if rows.length === 0}
    <p class="text-gray-400">Пока нет регистраций.</p>
  {:else}
    <div class="overflow-auto rounded border border-gray-700">
      <table class="w-full text-sm">
        <thead class="bg-gray-800">
          <tr class="text-left">
            <th class="px-4 py-3 text-white font-semibold">ID</th>
            <th class="px-4 py-3 text-white font-semibold">Создано</th>
            <th class="px-4 py-3 text-white font-semibold">Лидер</th>
            <th class="px-4 py-3 text-white font-semibold">Команда</th>
            <th class="px-4 py-3 text-white font-semibold">Кейс</th>
            <th class="px-4 py-3 text-white font-semibold">Телефон</th>
            <th class="px-4 py-3 text-white font-semibold">Email</th>
            <th class="px-4 py-3 text-white font-semibold">Организация</th>
            <th class="px-4 py-3 text-white font-semibold">Кол-во</th>
            <th class="px-4 py-3 text-white font-semibold">Участники</th>
            <th class="px-4 py-3 text-white font-semibold">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700 bg-gray-900">
          {#each rows as r}
            <tr class="align-top hover:bg-gray-800 transition-colors">
              <td class="px-4 py-3 text-gray-300">{r.id}</td>
              <td class="px-4 py-3 text-gray-300">
                {#if r.createdAt}
                  {new Date(r.createdAt).toLocaleString('ru-RU')}
                {/if}
              </td>
              <td class="px-4 py-3 font-medium text-white">{r.leaderFio}</td>
              <td class="px-4 py-3 text-white">{r.teamName}</td>
              <td class="px-4 py-3 text-white">Кейс {r.caseNumber || 1}</td>
              <td class="px-4 py-3 text-gray-300">{r.phone}</td>
              <td class="px-4 py-3 text-gray-300">{r.email}</td>
              <td class="px-4 py-3 text-gray-300">{r.organization}</td>
              <td class="px-4 py-3 text-white">
                  {r.membersCount}
              </td>
              <td class="px-4 py-3">
                {#if r.membersArray}
                  <ul class="text-sm">
                    {#each r.membersArray as member, i}
                      <li class="py-0.5">
                        <span class="text-gray-400">{i + 1}.</span> <span class="text-gray-200">{member}</span>
                      </li>
                    {/each}
                  </ul>
                {:else}
                  <span class="whitespace-pre-wrap text-gray-200">{r.membersFio}</span>
                {/if}
              </td>
              <td class="px-4 py-3">
                <button 
                  type="button"
                  onclick={() => confirmDelete(r.id, r.teamName)}
                  disabled={deletingId === r.id}
                  class="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white text-xs rounded transition-colors duration-200 flex items-center gap-1.5"
                >
                  {#if deletingId === r.id}
                    <svg class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Удаление...
                  {:else}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http:
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Удалить
                  {/if}
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>