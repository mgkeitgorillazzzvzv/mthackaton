import { redirect, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

export const load = async ({ cookies }: { cookies: any }) => {
  if (cookies.get('admin') === '1') throw redirect(302, '/admin');
  return {};
};

export const actions = {
  default: async ({ request, cookies, url }: { request: Request, cookies: any, url: URL }) => {
    const form = await request.formData();
    const token = String(form.get('token') ?? '');
    const valid = env.ADMIN_TOKEN ?? 'admin';
    if (token !== valid) {
      return fail(400, { error: 'Неверный пароль' });
    }

    const forwardedProto = request.headers.get('x-forwarded-proto');
    const isHttps = (forwardedProto?.split(',')[0].trim() ?? url.protocol.replace(':', '')) === 'https';
    
    cookies.set('admin', '1', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: !dev && isHttps,
      maxAge: 60 * 60 * 8 
    });
    throw redirect(303, '/admin');
  }
};