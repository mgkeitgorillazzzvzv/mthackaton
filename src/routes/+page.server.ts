import { db } from '$lib/server/db';
import { registration } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';


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


async function getTeamsCountForCase(caseNumber: number): Promise<number> {
	const teams = await db
		.select({ id: registration.id })
		.from(registration)
		.where(eq(registration.caseNumber, caseNumber));
	
	return teams.length;
}

export const actions = {
	default: async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const data = {
			leaderFio: String(formData.get('leaderFio') ?? ''),
			phone: String(formData.get('phone') ?? ''),
			email: String(formData.get('email') ?? ''),
			teamName: String(formData.get('teamName') ?? ''),
			membersFio: String(formData.get('membersFio') ?? ''),
			organization: String(formData.get('organization') ?? ''),
			caseNumber: parseInt(String(formData.get('caseNumber') ?? '1'))
		};

		
		const teamsOnCase = await getTeamsCountForCase(data.caseNumber);
		if (teamsOnCase >= 3) {
			return fail(400, {
				error: `На кейс ${data.caseNumber} уже зарегистрировано максимальное количество команд (3)`,
				...data
			});
		}

		
		const membersArray = data.membersFio
			.split(',')
			.map(name => name.trim())
			.filter(name => name.length > 0);

		
		if (membersArray.length !== 5) {
			return fail(400, { 
				error: 'В команде должно быть ровно 5 участников',
				...data
			});
		}

		
		const currentTotal = await getCurrentParticipantsCount();
		const newTotal = currentTotal + membersArray.length;

		if (newTotal > 60) {
			return fail(400, { 
				error: `Превышен лимит участников. Сейчас зарегистрировано ${currentTotal}, можно добавить еще ${60 - currentTotal}`,
				...data
			});
		}

		
		const remainingSlots = 60 - currentTotal;
		if (remainingSlots < 5) {
			return fail(400, { 
				error: `Осталось ${remainingSlots} мест, что недостаточно для формирования команды (нужно 5 человек). Регистрация закрыта.`,
				...data
			});
		}

		try {
			
			const [insertedRegistration] = await db.insert(registration).values({
				leaderFio: data.leaderFio,
				phone: data.phone,
				email: data.email,
				teamName: data.teamName,
				membersFio: data.membersFio, 
				organization: data.organization,
				caseNumber: data.caseNumber
			}).returning({ id: registration.id });

			
			
			
			
			
			
			

			return { success: true };
		} catch (error) {
			console.error('Database error:', error);
			return fail(500, { 
				error: 'Ошибка при сохранении данных. Попробуйте еще раз.',
				...data
			});
		}
	}
};

export const load = async () => {
	const currentParticipants = await getCurrentParticipantsCount();
	const remainingSlots = 60 - currentParticipants;
	const registrationAllow = currentParticipants < 60 && remainingSlots >= 5;
	
	
	const caseAvailability = await Promise.all([
		getTeamsCountForCase(1),
		getTeamsCountForCase(2),
		getTeamsCountForCase(3),
		getTeamsCountForCase(4)
	]);
	
	const casesInfo = caseAvailability.map((count, index) => ({
		number: index + 1,
		teamsCount: count,
		available: count < 3
	}));
	
	return { 
		registrationAllow,
		currentParticipants,
		remainingSlots,
		casesInfo
	};
}