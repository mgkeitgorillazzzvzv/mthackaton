<script lang="ts">
import bus from '$lib/assets/bus.png';
import tram from '$lib/assets/tram.png';
import pattern from '$lib/assets/pattern.svg';
import case1 from '$lib/assets/1.svg';
import case2 from '$lib/assets/2.svg';
import case3 from '$lib/assets/3.svg';
import mosobr from '$lib/assets/mosobr.png';
import laptop from '$lib/assets/laptop.png';
import mtLogo from '$lib/assets/mt_logo.png';
import Toast from '$lib/components/Toast.svelte';
import { enhance } from '$app/forms';
import troika from '$lib/assets/troika.png';
import emblem from '$lib/assets/emblem.png';
import mgt from '$lib/assets/mgt.svg';
import inv from '$lib/assets/inv.svg';
import deptrud from '$lib/assets/deptrud.svg';
import bestrans from '$lib/assets/bestrans.svg';
import mtp from '$lib/assets/mtp.svg';
import case4 from '$lib/assets/4.svg';
import { fade, scale } from 'svelte/transition';
import { quintOut } from 'svelte/easing';
import mosobr_footer from '$lib/assets/mosobr_footer.png';
let { form: actionResult, data } = $props<{ form: any, data: any }>();


let showModal = $state(false);
let selectedCase = $state<number | null>(null);


const cases = [
    {
        id: 1,
        title: "Определение количества припаркованных автомобилей при помощи компьютерного зрения и моделей машинного обучения",
        description: "Москва, как современный мегаполис, активно использует множество данных для управления городской инфраструктурой и принятия взвешенных решений. Одной из важных задач является мониторинг транспортной активности: интенсивность движения автомобилей, загрузка дорог и парковок. В рамках данного кейса мы сконцентрируемся на парковках и применим инновационный подход к их анализу.",
        client: "МосТрансПроект",
        image: case1
    },
    {
        id: 2,
        title: "Интеграция технологий ИИ в транспортное моделирование",
        description: "Необходимо с применением ИИ подготовить рекомендации, направленные на улучшение дорожно-транспортной ситуации",
        client: "Безопасный транспорт",
        image: case2
    },
    {
        id: 3,
        title: "Разработка AI-помощника Корпоративного университета Транспортного Комплекса",
        description: "Сегодня всё больше процессов автоматизируется с помощью искусственного интеллекта. Компании стремятся снизить нагрузку на сотрудников поддержки и при этом повысить качество обслуживания клиентов. Пользователи ожидают, что смогут задать вопрос в любое время суток и получить точный, понятный и быстрый ответ. Именно поэтому появляется потребность в роботах-консультантах, которые способны вести диалог не по заранее зашитым скриптам, а гибко и естественно, как настоящий специалист.",
        client: "Московский метрополитен",
        image: case3
    },
    {
        id: 4,
        title: "Решить с помощью эмулятора неисправность камер телеобзора",
        description: "Каждую минуту для обеспечения безопасности движения и управления потоками на улично-дорожной сети г. Москва диспетчеры ГКУ ЦОДД наблюдают за обстановкой через камеры телеобзора, установленные на улично-дорожной сети. Иногда видеопоток с некоторых камер начинает останавливаться или картинка начинает «разваливаться» и наблюдение становится крайне затруднительным.",
        client: "ЦОДД",
        image: case4
    }
];

function openCaseModal(caseId: number) {
    selectedCase = caseId;
    showModal = true;
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    showModal = false;
    selectedCase = null;
    
    document.body.style.overflow = '';
}

let form = $state({
    leaderFio: "",
    phone: "",
    email: "",
    teamName: "",
    membersFio: "",
    organization: "",
    caseNumber: 1,
});

let touched = $state({} as Record<string, boolean>);
let submitted = $state(false);
let consent = $state(false);


let toastMessage = $state('');
let toastType: 'success' | 'error' | 'warning' = $state('success');
let showToast = $state(false);

let formElement = $state<HTMLFormElement>();

function scrollToForm() {
    if (formElement) {
        formElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function errorFor(key: keyof typeof form): string | null {
    const v = form[key];
    
    
    if (key === "caseNumber") return null;
    
    
    const value = String(v);
    
    switch (key) {
        case "leaderFio":
            return value.trim() ? null : "Укажите ФИО представителя";
        case "phone": {
            const digits = value.replace(/\D/g, "");
            return digits.length >= 11
                ? null
                : "Укажите телефон в формате +7 (XXX) XXX-XX-XX";
        }
        case "email":
            return /.+@.+\..+/.test(value.trim()) ? null : "Неверный E‑mail";
        case "teamName":
            return value.trim()
                ? null
                : "Укажите название команды";
        case "membersFio": {
            if (!value.trim()) return "Перечислите участников через запятую";

            const members = value.split(',').map((name: string) => name.trim()).filter((name: string) => name.length > 0);
            if (members.length !== 5) return "В команде должно быть ровно 5 участников";
            
            
            if (data?.remainingSlots !== undefined) {
                if (data.remainingSlots < 5) {
                    return `Осталось ${data.remainingSlots} мест, что недостаточно для формирования команды`;
                }
            }
            
            return null;
        }
        case "organization":
            return value.trim() ? null : "Укажите учебное заведение";
        default:
            return null;
    }
}

const isValid = $derived(
    data?.registrationAllow &&
    !errorFor("leaderFio") &&
        !errorFor("phone") &&
        !errorFor("email") &&
        !errorFor("teamName") &&
        !errorFor("membersFio") &&
        !errorFor("organization") &&
        consent,
);

function formatRuPhone(v: string): string {
    const d = v.replace(/\D/g, "");
    let s = d;
    if (s.startsWith("8")) s = "7" + s.slice(1);
    if (!s.startsWith("7")) s = "7" + s;
    const p1 = s.slice(1, 4);
    const p2 = s.slice(4, 7);
    const p3 = s.slice(7, 9);
    const p4 = s.slice(9, 11);
    let out = "+7";
    if (p1) out += ` (${p1}` + (p1.length === 3 ? ") " : "");
    if (p2) out += p1.length === 3 ? `${p2}` : "";
    if (p3) out += `-${p3}`;
    if (p4) out += `-${p4}`;
    return out;
}

function onPhoneInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    form.phone = formatRuPhone(target.value);
}

const availableParticipantsText = $derived.by(() => {
    if (data?.remainingSlots === undefined) return '5 человек';
    if (data.remainingSlots >= 5) return '5 человек';
    return `${data.remainingSlots} человек (регистрация закрыта)`;
}); 

function showToastMessage(message: string, type: 'success' | 'error' | 'warning') {
    toastMessage = message;
    toastType = type;
    showToast = true;
}

function closeToast() {
    showToast = false;
}


$effect(() => {
    if (actionResult?.success) {
        
        form = {
            leaderFio: "",
            phone: "",
            email: "",
            teamName: "",
            membersFio: "",
            organization: "",
            caseNumber: 1,
        };
        consent = false;
        touched = {};
        submitted = false;
        
        
        showToastMessage('Заявка успешно отправлена!', 'success');
    } else if (actionResult?.error) {
        
        showToastMessage(actionResult.error, 'error');
        
        if (actionResult.leaderFio !== undefined) {
            
            form = {
                leaderFio: actionResult.leaderFio || "",
                phone: actionResult.phone || "",
                email: actionResult.email || "",
                teamName: actionResult.teamName || "",
                membersFio: actionResult.membersFio || "",
                organization: actionResult.organization || "",
                caseNumber: actionResult.caseNumber || 1,
            };
        }
    }
});

</script>

<div class="flex flex-row justify-between px-5 md:px-15 w-full py-4">
    <div class="font-bold font-unbounded md:text-lg">Хакатон Колледжей</div>

    <button 
        class="bg-white text-black font-bold py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        onclick={scrollToForm}
    >
        Зарегистрироваться
    </button>
</div>

<div class="relative w-full hero-section">
    <div class="bg-[url('/bg_1.png')] bg-cover bg-center h-[60vh] md:h-[600px] w-full flex flex-col justify-center items-center text-left px-4 relative overflow-visible">
    
    <div class="absolute inset-0 pointer-events-none hero-gradient"></div>
    <div class="relative z-40 text-white font-unbounded font-bold text-3xl md:text-4xl lg:text-6xl mb-4 hero-text">Хакатон Колледжей Москвы - 
Московский транспорт</div>
    </div>

    
    
    <img src={mosobr} alt="Московское образование" class="hero-mosobr z-50" />
    
    
    <img src={laptop} alt="Ноутбук" class="hero-laptop z-5" />
    
    
    <img src={mtLogo} alt="Московский транспорт" class="hero-mt-logo z-50" />

    <img src={bus} alt="Автобус" class="hero-bus z-40" />
    <img src={tram} alt="Трамвай" class="hero-tram z-40" />
    <img src={troika} alt="Тройка" class="hero-troika z-40" />
    <img src={emblem} alt="Герб Москвы" class="hero-emblem z-40" />

    
    <img src={pattern} alt="pattern" class="absolute left-0 top-full w-full h-[20vh] md:h-[35vh] object-cover -translate-y-1/2 transform z-20 pointer-events-none" />
</div>

<div class="relative w-full px-4">
    <div class="relative w-full h-[60vh] md:h-[600px] items-center hidden md:flex">
        
        <div class="absolute inset-0 bg-2-layer"></div>

        
        <div class="absolute inset-0 pointer-events-none hero-gradient "></div>

        <div class="p-default relative z-60 flex-col md:flex-row items-center justify-between gap-10 flex">
            <div class="font-unbounded font-bold text-2xl md:text-4xl max-w-xl ">
               Хакатон про перспективные ИТ–разработки для Московского транспорта
            </div>
            <div class="flex flex-col gap-2">
                <div class="font-bold text-2xl">
                    Стань тем, кто создает новую реальность
                </div>
                <div class="text-xl">Если ты из Москвы или Подмосковья, студент колледжа, то мы ждем тебя на хакатоне.</div>
                <div class="text-xl">Работая над реальными кейсами, ты узнаешь, как проектируется инфраструктура городского транспорта и что важно учитывать в этом процессе. </div>
            </div>
        </div>
    </div>
</div>
<div class="font-unbounded px-5 md:px-15 text-3xl md:text-4xl lg:text-5xl font-bold text-left mt-25 md:mt-10 mb-6">Кейсы</div>


<div class="md:hidden px-5">
    <div class="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
        <button onclick={() => openCaseModal(1)} class="case-card relative flex-shrink-0 w-[80vw] snap-center">
            <img src={case1} alt="case1" class="w-full"/>
            <div class="absolute bottom-0 left-0 p-4">
                <span class="case-overlay font-unbounded font-bold text-white text-xl text-left leading-tight">Кейс 1</span>
            </div>
        </button>
        <button onclick={() => openCaseModal(2)} class="case-card relative flex-shrink-0 w-[80vw] snap-center">
            <img src={case2} alt="case2" class="w-full"/>
            <div class="absolute bottom-0 left-0 p-4">
                <span class="case-overlay font-unbounded font-bold text-white text-xl text-left leading-tight">Кейс 2</span>
            </div>
        </button>
        <button onclick={() => openCaseModal(3)} class="case-card relative flex-shrink-0 w-[80vw] snap-center">
            <img src={case3} alt="case3" class="w-full"/>
            <div class="absolute bottom-0 left-0 p-4">
                <span class="case-overlay font-unbounded font-bold text-white text-xl text-left leading-tight">Кейс 3</span>
            </div>
        </button>
        <button onclick={() => openCaseModal(4)} class="case-card relative flex-shrink-0 w-[80vw] snap-center">
            <img src={case4} alt="case4" class="w-full"/>
            <div class="absolute bottom-0 left-0 p-4">
                <span class="case-overlay font-unbounded font-bold text-white text-xl text-left leading-tight">Кейс 4</span>
            </div>
        </button>
    </div>
    
    <div class="text-center text-gray-400 text-sm -mt-2">← Свайпните для просмотра всех кейсов →</div>
</div>


<div class="hidden md:flex flex-row gap-2 px-5 md:px-15">
    <button onclick={() => openCaseModal(1)} class="case-card relative w-full md:w-1/4">
        <img src={case1} alt="case1" class="w-full"/>
        <div class="absolute bottom-0 left-0 p-4">
            <span class="case-overlay font-unbounded font-bold text-white text-xl md:text-2xl lg:text-3xl text-left leading-tight">Кейс 1</span>
        </div>
    </button>
    <button onclick={() => openCaseModal(2)} class="case-card relative w-full md:w-1/4">
        <img src={case2} alt="case2" class="w-full"/>
        <div class="absolute bottom-0 left-0 p-4">
            <span class="case-overlay font-unbounded font-bold text-white text-xl md:text-2xl lg:text-3xl text-left leading-tight">Кейс 2</span>
        </div>
    </button>
    <button onclick={() => openCaseModal(3)} class="case-card relative w-full md:w-1/4">
        <img src={case3} alt="case3" class="w-full"/>
        <div class="absolute bottom-0 left-0 p-4">
            <span class="case-overlay font-unbounded font-bold text-white text-xl md:text-2xl lg:text-3xl text-left leading-tight">Кейс 3</span>
        </div>
    </button>
    <button onclick={() => openCaseModal(4)} class="case-card relative w-full md:w-1/4">
        <img src={case4} alt="case4" class="w-full"/>
        <div class="absolute bottom-0 left-0 p-4">
            <span class="case-overlay font-unbounded font-bold text-white text-xl md:text-2xl lg:text-3xl text-left leading-tight">Кейс 4</span>
        </div>
    </button>
</div>

<div class="p-default mt-20">
    <div class="border border-[#FA3F49] bg-gradient-to-b from-[#F24C40] to-black rounded-2xl p-6">
        <div class="font-bold text-2xl text-white mb-4" id="register">Форма регистрации</div>
        {#if data?.registrationAllow}
            <form
                bind:this={formElement}
                class="flex flex-col gap-4 items-start"
                method="POST"
                use:enhance={() => {
                    submitted = true;
                    
                    return async ({ result, update }) => {
                        
                        await update({ reset: false });
                        submitted = false;
                    };
                }}
            >
                <input
                    type="text"
                    name="leaderFio"
                    placeholder="ФИО наставника команды"
                    class="form-input-base {errorFor('leaderFio') ? 'form-input-error' : ''}"
                    bind:value={form.leaderFio}
                    onblur={() => (touched.leaderFio = true)}
                />
                {#if touched.leaderFio && errorFor('leaderFio')}
                    <p class="text-red-400 text-sm">{errorFor('leaderFio')}</p>
                {/if}

                <input
                    type="tel"
                    name="phone"
                    placeholder="+7 (___) _ - _ _ - _ _"
                    class="form-input-base {errorFor('phone') ? 'form-input-error' : ''}"
                    value={form.phone}
                    oninput={onPhoneInput}
                    onblur={() => (touched.phone = true)}
                />
                {#if touched.phone && errorFor('phone')}
                    <p class="text-red-400 text-sm">{errorFor('phone')}</p>
                {/if}

                <input
                    type="email"
                    name="email"
                    placeholder="Почта"
                    class="form-input-base {errorFor('email') ? 'form-input-error' : ''}"
                    bind:value={form.email}
                    onblur={() => (touched.email = true)}
                />
                {#if touched.email && errorFor('email')}
                    <p class="text-red-400 text-sm">{errorFor('email')}</p>
                {/if}

                <input
                    type="text"
                    name="teamName"
                    placeholder="Название команды"
                    class="form-input-base {errorFor('teamName') ? 'form-input-error' : ''}"
                    bind:value={form.teamName}
                    onblur={() => (touched.teamName = true)}
                />
                {#if touched.teamName && errorFor('teamName')}
                    <p class="text-red-400 text-sm">{errorFor('teamName')}</p>
                {/if}

                <textarea
                    name="membersFio"
                    placeholder="ФИО участников команды (через запятую, {availableParticipantsText})"
                    rows="4"
                    class="form-input-base resize-none {errorFor('membersFio') ? 'form-input-error' : ''}"
                    bind:value={form.membersFio}
                    onblur={() => (touched.membersFio = true)}
                ></textarea>
                {#if touched.membersFio && errorFor('membersFio')}
                    <p class="text-red-400 text-sm">{errorFor('membersFio')}</p>
                {/if}

                <input
                    type="text"
                    name="organization"
                    placeholder="Учебное заведение"
                    class="form-input-base {errorFor('organization') ? 'form-input-error' : ''}"
                    bind:value={form.organization}
                    onblur={() => (touched.organization = true)}
                />
                {#if touched.organization && errorFor('organization')}
                    <p class="text-red-400 text-sm">{errorFor('organization')}</p>
                {/if}

                <div class="w-full">
                    <label for="caseNumber" class="text-white text-sm mb-2 block">Выберите кейс</label>
                    <select
                        id="caseNumber"
                        name="caseNumber"
                        bind:value={form.caseNumber}
                        class="form-input-base w-full"
                    >
                        {#each data?.casesInfo || [] as caseInfo}
                            <option value={caseInfo.number} disabled={!caseInfo.available}>
                                Кейс {caseInfo.number} ({caseInfo.teamsCount}/3 команд{caseInfo.available ? '' : ' - заполнен'})
                            </option>
                        {/each}
                    </select>
                </div>
                <div class="w-full text-sm text-gray-400">С кейсами можно ознакомиться <a href="/cases" class="border-gray-400 border-b">здесь</a>.</div>

                <div class="mt-3 flex flex-col gap-1">
                    <label
                        class="flex items-start gap-2 cursor-pointer select-none"
                    >
                        <input
                            type="checkbox"
                            bind:checked={consent}
                            class="w-4 h-4 border-2 border-blue-500 rounded bg-transparent mt-0.5 cursor-pointer accent-blue-500"
                        />
                        <span class="text-white text-sm leading-tight">Даю согласие на обработку персональных данных</span>
                    </label>
                </div>

                <button
                    type="submit"
                    class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors {submitted ? 'opacity-50' : ''}"
                    disabled={!isValid || submitted}
                >
                    {submitted ? 'Отправка...' : 'Отправить'}
                </button>
            </form>
        {:else}
            <div class="text-white text-xl font-bold">
                Регистрация закрыта
            </div>
        {/if}
    </div>
</div>


<footer class="bg-[#A00D0F] w-full py-8">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h3 class="font-bold text-4xl text-white">Организаторы проекта</h3>
        </div>
        
        
        <div class="hidden md:flex justify-center items-center gap-8 flex-wrap">
                                <img src={mosobr_footer} alt="Московское образование" class="h-20 w-auto object-contain" style="filter: brightness(0) invert(1);" />
                    <img src={mgt} alt="МГТ" class="h-20 w-auto object-contain" />
                    <img src={inv} alt="Транспортные инновации" class="h-20 w-auto object-contain" />
                    <img src={deptrud} alt="Департамент труда и социальной защиты населения" class="h-20 w-auto object-contain" />
                    <img src={bestrans} alt="Безопасный транспорт" class="h-20 w-auto object-contain" />
                    
            <img src={mtp} alt="МТИ" class="h-20 w-auto object-contain" />
        </div>
        
        
        <div class="md:hidden">
            <div class="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-2">
                <div class="flex-shrink-0">
                    <img src={mosobr_footer} alt="Московское образование" class="h-20 w-auto object-contain" style="filter: brightness(0) invert(1);" />
                </div>
                <div class="flex-shrink-0">
                    <img src={mgt} alt="МГТ" class="h-20 w-auto object-contain" />
                </div>
                <div class="flex-shrink-0">
                    <img src={inv} alt="Транспортные инновации" class="h-20 w-auto object-contain" />
                </div>
                <div class="flex-shrink-0">
                        <img src={deptrud} alt="Департамент труда и социальной защиты населения" class="h-20 w-auto object-contain" />
                </div>
                <div class="flex-shrink-0">
                        <img src={bestrans} alt="Безопасный транспорт" class="h-20 w-auto object-contain" />
                </div>
                <div class="flex-shrink-0">
                    <img src={mtp} alt="МТИ" class="h-20 w-auto object-contain" />
                </div>

            </div>
        </div>
            <div class="flex justify-center mt-8">
                <a class="text-4xl border p-2 border-white text-white font-bold hover:bg-white hover:text-[#A00D0F] transition-colors text-center" href="ПОЛОЖЕНИЕ_о_хакатоне_Колледжей_Москвы_Московский_транспорт.docx" download>
                    ПОЛОЖЕНИЕ О ХАКАТОНЕ
                </a>
            </div>

    </div>
</footer>


{#if showModal && selectedCase !== null}
    <div 
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4"
        onclick={closeModal}
        onkeydown={(e) => e.key === 'Escape' && closeModal()}
        role="button"
        tabindex="-1"
        transition:fade={{ duration: 200 }}
    >
        <div 
            class="bg-gradient-to-b from-[#1a1a1a] to-black border border-[#FA3F49] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabindex="0"
            transition:scale={{ 
                duration: 300, 
                easing: quintOut,
                start: 0.9,
                opacity: 0
            }}
        >
            <div class="modal-header sticky top-0 bg-gradient-to-b from-[#F24C40] to-[#1a1a1a] p-6 border-b border-[#FA3F49] flex justify-between items-start z-10">
                <h2 class="font-unbounded font-bold text-2xl md:text-3xl text-white pr-8">
                    Кейс {selectedCase}
                </h2>
                <button 
                    onclick={closeModal}
                    class="text-white hover:text-[#FA3F49] hover:rotate-90 text-3xl font-bold transition-all duration-300 flex-shrink-0"
                    aria-label="Закрыть"
                >
                    ×
                </button>
            </div>
            
            <div class="p-6">
                {#each cases as caseItem}
                    {#if caseItem.id === selectedCase}
                        <div class="modal-content space-y-4">
                            <h3 class="font-unbounded font-bold text-xl md:text-2xl text-white">
                                {caseItem.title}
                            </h3>
                            
                            <p class="text-gray-300 text-base md:text-lg leading-relaxed">
                                {caseItem.description}
                            </p>
                            
                            <div class="pt-4 border-t border-gray-700">
                                <p class="text-sm text-gray-400">
                                    {caseItem.client}
                                </p>
                            </div>
                            
                            <div class="flex justify-end pt-4">
                                <button
                                    onclick={closeModal}
                                    class="bg-[#FA3F49] hover:bg-[#d63439] text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
{/if}

<Toast 
    message={toastMessage} 
    type={toastType} 
    bind:show={showToast} 
    onClose={closeToast} 
/>

<style>
    .scrollbar-hide {
        -ms-overflow-style: none;  
        scrollbar-width: none;  
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch; 
    }
    
    .scrollbar-hide::-webkit-scrollbar {
        display: none;  
    }

    
    .case-card {
        display: block;
        text-decoration: none;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
        border: none;
        background: none;
        padding: 0;
    }
    
    .case-card:hover {
        transform: translateY(-12px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    
    @media (max-width: 768px) {
        .case-card:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
    }

    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    :global(.modal-header) {
        animation: slideDown 0.3s ease-out;
    }

    :global(.modal-content) {
        animation: fadeInUp 0.4s ease-out 0.1s both;
    }
</style>