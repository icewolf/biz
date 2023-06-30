// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	type ApiClient = import('wretch/addons/queryString').QueryStringAddon &
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
		trello: ApiClient;
		invoiceNinja: ApiClient;
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
