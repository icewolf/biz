<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolvePath } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { superForm, setMessage } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';

	export let data;

	let waiting = false;

	$: ({ supabase, session } = data);

	const { form, enhance, constraints, message } = superForm(data.form, {
		async onUpdated({ form }) {
			if (form.valid) {
				waiting = true;
			}
		}
	});

	$: if (data.session) goto(resolvePath('/'));
</script>

<div class="h-screen flex flex-col items-center">
	<div class="m-auto">
		<div class="card p-4 space-y-2 w-sm">
			<div>
				<h2 class="h2">Login</h2>
			</div>
			{#if !waiting}
				<form
					class="space-y-2"
					method="POST"
					action="?/magiclink"
					use:enhance
					in:slide={{ duration: 300, delay: 300 }}
					out:slide={{ duration: 300 }}
				>
					<label class="label">
						<span>Email</span>
						<input
							name="email"
							class="input"
							type="email"
							placeholder="user@example.com"
							bind:value={$form.email}
							{...$constraints}
						/>
					</label>
					{#if $message}
						<div
							class="rounded-md p-4 "
							class:bg-error-500={$page.status >= 400}
							class:bg-success-500={$page.status < 400}
						>{$message}</div>
					{/if}
					<div class="flex flex-col items-end">
						<button class="btn variant-filled-primary w-full">Send Link</button>
					</div>
				</form>
			{:else}
				<div
					class="flex flex-col h-full items-center"
					in:slide={{ duration: 300, delay: 300 }}
					out:slide={{ duration: 300 }}
				>
					<p class="m-auto">Click the link your email to login!</p>
				</div>
			{/if}
		</div>
	</div>
</div>
