// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
declare namespace App {
	type WretchAPIClient = import('wretch/addons/queryString').QueryStringAddon &
		import('wretch').Wretch<
			import('wretch/addons/queryString').QueryStringAddon,
			unknown,
			undefined
		>;
	interface Locals {
		getSession(): Promise<import('@supabase/supabase-js').Session | null>;
		supabase: import('@supabase/supabase-js').SupabaseClient<
			import('$lib/types/supabase').Database
		>;
		trello: WretchAPIClient;
		invoiceNinja: WretchAPIClient;
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
