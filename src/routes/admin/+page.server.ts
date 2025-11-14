import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { registration } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

async function getCurrentParticipantsCount(): Promise<number> {
	const registrations = await db.select({ membersFio: registration.membersFio }).from(registration);
	
	let totalCount = 0;
	for (const reg of registrations) {
		const members = reg.membersFio
			.split(',')
			.map(name => name.trim())
			.filter(name => name.length > 0);
		totalCount += members.length;
	}
	
	return totalCount;
}

export const load = async ({ cookies }: { cookies: any }) => {
  const isAdmin = cookies.get('admin') === '1';
  if (!isAdmin) throw redirect(303, '/admin/login');

  const regs = await db
    .select()
    .from(registration)
    .orderBy(desc(registration.createdAt));

  
  const registrationsWithCounts = regs.map(reg => {
    const membersArray = reg.membersFio
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    return {
      ...reg,
      membersArray,
      membersCount: membersArray.length,
      caseNumber: reg.caseNumber || 1
    };
  });

  const totalParticipants = await getCurrentParticipantsCount();

  return { 
    registrations: registrationsWithCounts,
    totalParticipants,
    remainingSlots: 60 - totalParticipants
  };
};

export const actions = {
  deleteRegistration: async ({ request, cookies }: { request: Request, cookies: any }) => {
    const isAdmin = cookies.get('admin') === '1';
    if (!isAdmin) {
      return fail(403, { error: 'Доступ запрещен' });
    }

    const data = await request.formData();
    const registrationId = data.get('registrationId');

    if (!registrationId || typeof registrationId !== 'string') {
      return fail(400, { error: 'Некорректный ID заявки' });
    }

    try {
      await db.delete(registration).where(eq(registration.id, parseInt(registrationId)));
      return { success: true };
    } catch (error) {
      console.error('Ошибка при удалении заявки:', error);
      return fail(500, { error: 'Ошибка при удалении заявки' });
    }
  }
};