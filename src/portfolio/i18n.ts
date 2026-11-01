export const locales = ["en", "ro", "se"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
/** Locales that are built but hidden from the switcher and language detection (temporarily). */
export const disabledLocales: ReadonlySet<Locale> = new Set<Locale>(["ro"]);

/** Path segment -> BCP 47 tag. The Swedish path is /se, but the language tag is "sv". */
export const htmlLang: Record<Locale, string> = { en: "en", ro: "ro", se: "sv" };

/** A string in every supported locale. */
export type T = Record<Locale, string>;

export function isLocale(value: string): value is Locale {
    return (locales as readonly string[]).includes(value);
}

export function formatMonth(ym: string, locale: Locale): string {
    const [y, m] = ym.split("-").map(Number);
    return new Intl.DateTimeFormat(htmlLang[locale], { month: "short", year: "numeric", timeZone: "UTC" }).format(
        new Date(Date.UTC(y, m - 1, 1)),
    );
}

export const ui = {
    en: {
        metaTitle: "Bogdan-Laurentiu Stefanescu – Software Engineer",
        metaDescription:
            "MSc student in Distributed Systems and teaching assistant at KTH. Full-stack web development, distributed systems and decentralised identity.",
        headline: "Software engineer · MSc Distributed Systems student and Teaching Assistant at KTH",
        location: "Stockholm, Sweden",
        kinds: { EDU: "education", EXP: "experience", PRJ: "projects", CERT: "certifications", EVT: "competitions & volunteering" },
        head: "you are here",
        open: "open",
        present: "Present",
        merged: "merged",
        branchedFrom: "branched from main",
        initTitle: "Initial commit",
        initSub: "Bucharest, Romania",
        skills: "Stack",
        languages: "Languages",
        levels: { native: "native" },
        log: "History",
        scroll: "scroll to read the log",
        footer: "Built with Next.js and three.js.",
        // The English version is the original, so it carries no translation note.
        translationNote: null as string | null,
        readOriginal: null as string | null,
        switchLabel: "Language",
        filterAll: "all",
        contactTitle: "Contact",
        contactIntro: "Want to work together, or just say hi? Send me a message and I'll reply by email.",
        contactLink: "send a message",
        formName: "Name",
        formEmail: "Your email",
        formMessage: "Message",
        formSend: "Send",
        formSending: "Sending…",
        formSent: "Thanks! Your message is on its way. I'll reply by email.",
        formError: "Something went wrong. Please try again later.",
        formInvalid: "Please fill in every field, with a valid email address.",
        formRateLimited: "Too many messages. Please try again in a few minutes.",
        formCaptcha: "Please complete the verification check.",
        openBranches: (n: number) => (n === 1 ? "1 open branch" : `${n} open branches`),
        filterLabel: "Filter branches by category",
        canvasLabel: "Animated aurora-like ribbons with drifting data nodes",
        pauseMotion: "Pause animations",
        playMotion: "Play animations",
    },
    ro: {
        metaTitle: "Bogdan-Laurentiu Stefanescu – Inginer software",
        metaDescription:
            "Student la masterul de Sisteme Distribuite și asistent de predare la KTH. Dezvoltare web full-stack, sisteme distribuite și identitate descentralizată.",
        headline: "Inginer software · Student la masterul de Sisteme Distribuite și asistent de predare la KTH",
        location: "Stockholm, Suedia",
        kinds: { EDU: "educație", EXP: "experiență", PRJ: "proiecte", CERT: "certificări", EVT: "competiții și voluntariat" },
        head: "ești aici",
        open: "în curs",
        present: "Prezent",
        merged: "integrat",
        branchedFrom: "ramificat din main",
        initTitle: "Primul commit",
        initSub: "București, România",
        skills: "Tehnologii",
        languages: "Limbi",
        levels: { native: "maternă" },
        log: "Istoric",
        scroll: "derulează pentru a citi istoricul",
        footer: "Construit cu Next.js și three.js.",
        translationNote: "Această pagină a fost tradusă din engleză cu ajutorul AI și poate conține inexactități. În caz de diferențe, versiunea în engleză prevalează.",
        readOriginal: "Citește versiunea în engleză",
        switchLabel: "Limbă",
        filterAll: "toate",
        contactTitle: "Contact",
        contactIntro: "Vrei să colaborăm sau doar să saluți? Trimite-mi un mesaj și îți răspund pe email.",
        contactLink: "trimite un mesaj",
        formName: "Nume",
        formEmail: "Emailul tău",
        formMessage: "Mesaj",
        formSend: "Trimite",
        formSending: "Se trimite…",
        formSent: "Mulțumesc! Mesajul a fost trimis. Îți voi răspunde pe email.",
        formError: "Ceva n-a mers bine. Te rog încearcă mai târziu.",
        formInvalid: "Te rog completează toate câmpurile, cu o adresă de email validă.",
        formRateLimited: "Prea multe mesaje. Te rog încearcă din nou peste câteva minute.",
        formCaptcha: "Te rog finalizează verificarea.",
        openBranches: (n: number) => (n === 1 ? "1 ramură deschisă" : `${n} ramuri deschise`),
        filterLabel: "Filtrează ramurile după categorie",
        canvasLabel: "Panglici animate asemănătoare aurorei, cu noduri de date în mișcare",
        pauseMotion: "Oprește animațiile",
        playMotion: "Pornește animațiile",
    },
    se: {
        metaTitle: "Bogdan-Laurentiu Stefanescu – Mjukvaruingenjör",
        metaDescription:
            "Masterstudent i distribuerade system och lärarassistent på KTH. Fullstack-webbutveckling, distribuerade system och decentraliserad identitet.",
        headline: "Mjukvaruingenjör · Masterstudent i distribuerade system och lärarassistent på KTH",
        location: "Stockholm, Sverige",
        kinds: { EDU: "utbildning", EXP: "erfarenhet", PRJ: "projekt", CERT: "certifieringar", EVT: "tävlingar och volontärarbete" },
        head: "du är här",
        open: "pågående",
        present: "Pågående",
        merged: "sammanfogad",
        branchedFrom: "förgrenad från main",
        initTitle: "Första commit",
        initSub: "Bukarest, Rumänien",
        skills: "Teknik",
        languages: "Språk",
        levels: { native: "modersmål" },
        log: "Historik",
        scroll: "skrolla för att läsa loggen",
        footer: "Byggd med Next.js och three.js.",
        translationNote: "Den här sidan har översatts från engelska med hjälp av AI och kan innehålla felaktigheter. Vid skillnader gäller den engelska versionen.",
        readOriginal: "Läs den engelska versionen",
        switchLabel: "Språk",
        filterAll: "alla",
        contactTitle: "Kontakt",
        contactIntro: "Vill du samarbeta, eller bara säga hej? Skicka ett meddelande så svarar jag via e-post.",
        contactLink: "skicka ett meddelande",
        formName: "Namn",
        formEmail: "Din e-post",
        formMessage: "Meddelande",
        formSend: "Skicka",
        formSending: "Skickar…",
        formSent: "Tack! Ditt meddelande är skickat. Jag svarar via e-post.",
        formError: "Något gick fel. Försök igen senare.",
        formInvalid: "Fyll i alla fält med en giltig e-postadress.",
        formRateLimited: "För många meddelanden. Försök igen om några minuter.",
        formCaptcha: "Slutför verifieringen.",
        openBranches: (n: number) => (n === 1 ? "1 öppen gren" : `${n} öppna grenar`),
        filterLabel: "Filtrera grenar efter kategori",
        canvasLabel: "Animerade norrskensliknande band med drivande datanoder",
        pauseMotion: "Pausa animationer",
        playMotion: "Spela upp animationer",
    },
} satisfies Record<Locale, unknown>;

export type Dict = (typeof ui)[Locale];
