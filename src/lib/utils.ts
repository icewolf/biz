import { base } from '$app/paths';
import { resolvePath as resolvePathOrig } from '@sveltejs/kit';

export const resolvePath = ((routeId: string, params?: Record<string, string | undefined>) => {
	const path = resolvePathOrig(routeId, params ?? {});
	return `${base}${path}`;
}) satisfies typeof resolvePathOrig;
