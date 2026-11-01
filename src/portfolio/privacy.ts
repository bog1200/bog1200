// Privacy notice for the contact form (GDPR Art. 13), shown under the form.
// Keep it in sync with src/app/api/contact/route.ts if the form starts collecting or sending anything else.
import type { Locale } from "./i18n";

interface Notice {
    short: string;
    summary: string;
    items: { title: string; text: string; links?: { label: string; href: string }[] }[];
}

const links = {
    cloudflare: "https://www.cloudflare.com/turnstile-privacy-policy/",
    discord: "https://discord.com/privacy",
    imy: { en: "https://www.imy.se/en/", ro: "https://www.imy.se/en/", se: "https://www.imy.se/" } as Record<Locale, string>,
};

export const privacy: Record<Locale, Notice> = {
    en: {
        short: "Your name, email address and message are only used to reply to you. No newsletter, no marketing, never shared or sold.",
        summary: "Privacy notice (GDPR)",
        items: [
            {
                title: "Who is responsible",
                text: "Bogdan-Laurentiu Stefanescu, Stockholm, Sweden, is the controller of the data you send through this form. For any question about your data, use this form or LinkedIn.",
            },
            {
                title: "What I collect and why",
                text: "The name, email address and message you enter, used only to read and answer your message. The legal basis is my legitimate interest in replying to enquiries you choose to send (GDPR Art. 6(1)(f)).",
            },
            {
                title: "Spam protection",
                text: "Cloudflare Turnstile checks that the form is sent by a person; Cloudflare processes technical data such as your IP address for this. Your IP address is also held in server memory for up to 10 minutes to limit repeated messages, and is not saved.",
                links: [{ label: "Cloudflare Turnstile privacy", href: links.cloudflare }],
            },
            {
                title: "Who receives it",
                text: "Messages are delivered to me through a private Discord channel. Discord Inc. (USA) stores them on its servers, which may be outside the EU/EEA. The website host processes standard technical server logs.",
                links: [{ label: "Discord privacy policy", href: links.discord }],
            },
            {
                title: "How long it is kept",
                text: "Like ordinary email: for as long as it's relevant to our conversation. You can ask me to delete your message at any time.",
            },
            {
                title: "Your rights",
                text: "You can ask for access to, correction or deletion of your data, ask me to restrict its use, or object to it. You can also complain to the Swedish Authority for Privacy Protection (IMY).",
                links: [{ label: "imy.se", href: links.imy.en }],
            },
        ],
    },
    ro: {
        short: "Numele, adresa de email și mesajul tău sunt folosite doar pentru a-ți răspunde. Fără newsletter, fără marketing, nu sunt partajate sau vândute.",
        summary: "Notă de confidențialitate (GDPR)",
        items: [
            {
                title: "Cine este responsabil",
                text: "Bogdan-Laurentiu Stefanescu, Stockholm, Suedia, este operatorul datelor trimise prin acest formular. Pentru orice întrebare despre datele tale, folosește acest formular sau LinkedIn.",
            },
            {
                title: "Ce colectez și de ce",
                text: "Numele, adresa de email și mesajul introduse, folosite doar pentru a citi mesajul și a-ți răspunde. Temeiul legal este interesul meu legitim de a răspunde solicitărilor pe care alegi să mi le trimiți (art. 6 alin. (1) lit. f) GDPR).",
            },
            {
                title: "Protecție împotriva spamului",
                text: "Cloudflare Turnstile verifică faptul că formularul este trimis de o persoană; în acest scop, Cloudflare prelucrează date tehnice, cum ar fi adresa ta IP. Adresa IP este păstrată și în memoria serverului timp de cel mult 10 minute, pentru a limita mesajele repetate, și nu este salvată.",
                links: [{ label: "Confidențialitate Cloudflare Turnstile", href: links.cloudflare }],
            },
            {
                title: "Cine primește datele",
                text: "Mesajele îmi sunt livrate printr-un canal privat de Discord. Discord Inc. (SUA) le stochează pe serverele sale, care se pot afla în afara UE/SEE. Furnizorul de hosting prelucrează jurnale tehnice standard ale serverului.",
                links: [{ label: "Politica de confidențialitate Discord", href: links.discord }],
            },
            {
                title: "Cât timp sunt păstrate",
                text: "Ca orice email obișnuit: atât timp cât este relevant pentru conversația noastră. Îmi poți cere oricând să îți șterg mesajul.",
            },
            {
                title: "Drepturile tale",
                text: "Poți solicita accesul la datele tale, rectificarea sau ștergerea lor, restricționarea prelucrării sau te poți opune prelucrării. De asemenea, poți depune o plângere la autoritatea suedeză pentru protecția datelor (IMY).",
                links: [{ label: "imy.se", href: links.imy.ro }],
            },
        ],
    },
    se: {
        short: "Ditt namn, din e-postadress och ditt meddelande används bara för att svara dig. Inget nyhetsbrev, ingen marknadsföring, delas eller säljs aldrig.",
        summary: "Integritetsinformation (GDPR)",
        items: [
            {
                title: "Personuppgiftsansvarig",
                text: "Bogdan-Laurentiu Stefanescu, Stockholm, är personuppgiftsansvarig för uppgifterna du skickar via formuläret. Har du frågor om dina uppgifter kan du använda formuläret eller LinkedIn.",
            },
            {
                title: "Vad jag samlar in och varför",
                text: "Namnet, e-postadressen och meddelandet du anger, som bara används för att läsa och besvara ditt meddelande. Den rättsliga grunden är mitt berättigade intresse av att svara på förfrågningar som du väljer att skicka (artikel 6.1 f i GDPR).",
            },
            {
                title: "Skydd mot skräppost",
                text: "Cloudflare Turnstile kontrollerar att formuläret skickas av en människa; Cloudflare behandlar då tekniska uppgifter som din IP-adress. Din IP-adress hålls också i serverns minne i högst 10 minuter för att begränsa upprepade meddelanden, och sparas inte.",
                links: [{ label: "Cloudflare Turnstile – integritet", href: links.cloudflare }],
            },
            {
                title: "Vem som tar emot uppgifterna",
                text: "Meddelanden levereras till mig via en privat Discord-kanal. Discord Inc. (USA) lagrar dem på sina servrar, som kan finnas utanför EU/EES. Webbhotellet behandlar vanliga tekniska serverloggar.",
                links: [{ label: "Discords integritetspolicy", href: links.discord }],
            },
            {
                title: "Hur länge uppgifterna sparas",
                text: "Som vanlig e-post: så länge det är relevant för vår konversation. Du kan när som helst be mig radera ditt meddelande.",
            },
            {
                title: "Dina rättigheter",
                text: "Du kan begära tillgång till, rättelse eller radering av dina uppgifter, begära att behandlingen begränsas eller invända mot den. Du kan också klaga hos Integritetsskyddsmyndigheten (IMY).",
                links: [{ label: "imy.se", href: links.imy.se }],
            },
        ],
    },
};
