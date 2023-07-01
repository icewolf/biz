import {
	INVOICENINJA_API_TOKEN,
	TRELLO_API_KEY,
	TRELLO_API_TOKEN
} from '$env/static/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_INVOICENINJA_URL } from '$env/static/public';
import { resolvePath } from '$lib/utils';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import wretch from 'wretch';
import queryString from 'wretch/addons/queryString';

const setupSupabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		/**
		 * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
		 *
		 * https://github.com/sveltejs/kit/issues/8061
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

const checkAuth: Handle = async ({ event, resolve }) => {
	const { route, locals } = event;

	if (route.id?.startsWith('/(auth)')) {
		const session = await locals.getSession();
		if (!session) {
			throw redirect(303, resolvePath('/login'));
		}
	}

	return resolve(event);
};

const withAPIClients: Handle = ({ event, resolve }) => {
	const { fetch } = event;

	const baseClient = wretch().addon(queryString).polyfills({ fetch });

	event.locals.trello = baseClient
		.url('https://api.trello.com/1')
		.auth(`OAuth oauth_consumer_key="${TRELLO_API_KEY}", oauth_token="${TRELLO_API_TOKEN}"`);

	event.locals.invoiceNinja = baseClient
		.url(PUBLIC_INVOICENINJA_URL)
		.url('/api/v1')
		.headers({ 'x-api-token': INVOICENINJA_API_TOKEN });

	return resolve(event);
};

export const handle = sequence(setupSupabase, checkAuth, withAPIClients);
