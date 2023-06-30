import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/client';
import { fail, redirect } from '@sveltejs/kit';

const schema = z.object({
	email: z.string().email()
});

export const load = async ({ parent }) => {
	const { session } = await parent();
	if (session) throw redirect(303, '/');

	const form = await superValidate(schema);

	return { form };
};

export const actions = {
	magiclink: async (request) => {
		const {
			url,
			locals: { supabase }
		} = request;

		const form = await superValidate(request, schema);
		if (!form.valid) return fail(400, form);

		const { email } = form.data;

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: { emailRedirectTo: `${url.origin}/api/auth/callback`, shouldCreateUser: false }
		});
		if (error) return message(form, error.message, { status: 500 });

		return { form };
	}
};
