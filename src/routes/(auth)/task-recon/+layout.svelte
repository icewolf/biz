<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolvePath } from '$lib/utils.js';

	export let data;

	const handleClientChange = (
		e: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	) => {
		goto(resolvePath('/(auth)/task-recon/[clientId]', { clientId: e.currentTarget.value }));
	};
</script>

<h2 class="h2">Task Recon.</h2>

<div class="card p-4">
	<label
		><span>Client</span>
		<select class="select" on:change={handleClientChange} value={$page.data.client?.id}>
			{#each data.clients.data as client}
				<option value={client.id}>{client.display_name}</option>
			{/each}
		</select>
	</label>
</div>
<section>
	<slot />
</section>
