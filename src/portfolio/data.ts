// CV content for the portfolio, mirrored from CV/Bogdan_Stefanescu_CV.tex.
// Dates are "YYYY-MM"; end: null means ongoing (the branch is still open at HEAD).
// Projects hidden in the CV (Elemental Escape, rPay) are left out here too.
import type { T } from "./i18n";

export type Kind = "EDU" | "EXP" | "PRJ" | "CERT" | "EVT";

/** Technology names stay as-is; topic tags are translated. */
export type Tag = string | T;

export interface Link {
    label: string;
    href: string;
}

/** A long-running entry: forks from main at `start`, merges back at `end`. */
export interface BranchEntry {
    id: string;
    branch: string;
    kind: Kind;
    title: T;
    org?: string;
    location?: T;
    start: string;
    end: string | null;
    bullets: T[];
    tags?: Tag[];
    links?: Link[];
    milestones?: { date: string; text: T }[];
}

/** A one-off entry: a single commit on main. */
export interface CommitEntry {
    id: string;
    branch: string;
    kind: Kind;
    title: T;
    org?: T;
    location?: T;
    date: string;
    bullets?: T[];
    tags?: Tag[];
}

const same = (s: string): T => ({ en: s, ro: s, se: s });

const stockholm: T = { en: "Stockholm, Sweden", ro: "Stockholm, Suedia", se: "Stockholm, Sverige" };
const bucharest: T = { en: "Bucharest, Romania", ro: "București, România", se: "Bukarest, Rumänien" };
const kth = "KTH Royal Institute of Technology";

export const profile = {
    name: "Bogdan-Laurentiu Stefanescu",
    remotes: [
        { name: "github", label: "github.com/bog1200", href: "https://github.com/bog1200" },
        { name: "linkedin", label: "linkedin.com/in/sbogdan701", href: "https://www.linkedin.com/in/sbogdan701/" },
    ],
    languages: [
        { name: { en: "Romanian", ro: "Română", se: "Rumänska" } as T, level: "native" as const },
        { name: { en: "English", ro: "Engleză", se: "Engelska" } as T, level: "C1" },
        { name: { en: "French", ro: "Franceză", se: "Franska" } as T, level: "A2" },
        { name: { en: "Swedish", ro: "Suedeză", se: "Svenska" } as T, level: "A2" },
    ],
    skills: [
        { group: "languages", items: ["PHP", "TypeScript", "JavaScript", "Java", "C++", "Python", "SQL", "Solidity", "HTML5", "CSS3"].map(same) },
        { group: "frontend", items: ["Angular", "React", "Next.js", "Tailwind CSS", "SPA"].map(same) },
        {
            group: "backend",
            items: [
                ...["Node.js", "Express.js", "Knex", "Objection.js", "Spring Boot", "Spring Security", "PHP", "Symfony", "RESTful APIs", "OpenAPI", "Swagger", "OAuth2", "OpenID Connect", "JWT", "Passkeys (WebAuthn)"].map(same),
                { en: "Authentication & identity management", ro: "Autentificare și managementul identității", se: "Autentisering och identitetshantering" },
            ],
        },
        {
            group: "data-cloud",
            items: [
                ...["MySQL", "MariaDB", "PostgreSQL", "MongoDB", "Prisma", "Supabase"].map(same),
                { en: "Relational database design", ro: "Proiectarea bazelor de date relaționale", se: "Relationsdatabasdesign" },
                ...["Vercel", "Heroku", "Cloudflare R2", "Cloudflare mTLS"].map(same),
                { en: "Web hosting", ro: "Găzduire web", se: "Webbhotell" },
                same("DNS"),
                { en: "Deployment", ro: "Deployment", se: "Driftsättning" },
            ],
        },
        {
            group: "tools",
            items: [
                "Git", "GitHub", "Docker", "Docker Compose", "Multipass", "cloud-init", "Ethereum (ethers.js, Sepolia)", "WordPress", "WooCommerce",
                "UiPath (Studio, Robots, Orchestrator)", "Arduino", "OpenGL", "Java Swing",
            ].map(same),
        },
        {
            group: "areas",
            items: [
                { en: "Distributed systems", ro: "Sisteme distribuite", se: "Distribuerade system" },
                { en: "Full-stack web development", ro: "Dezvoltare web full-stack", se: "Fullstack-webbutveckling" },
                { en: "Software engineering", ro: "Inginerie software", se: "Mjukvaruutveckling" },
                { en: "Object-oriented programming", ro: "Programare orientată pe obiecte", se: "Objektorienterad programmering" },
                { en: "Containerisation", ro: "Containerizare", se: "Containerisering" },
                { en: "E-commerce", ro: "E-commerce", se: "E-handel" },
                { en: "Payment gateway integration", ro: "Integrarea procesatorilor de plăți", se: "Integration av betallösningar" },
                same("Blockchain"),
                { en: "Decentralised identity (DIDs)", ro: "Identitate descentralizată (DID)", se: "Decentraliserad identitet (DID)" },
                { en: "Robotic process automation (RPA)", ro: "Automatizarea proceselor (RPA)", se: "Robotiserad processautomation (RPA)" },
                { en: "Cybersecurity", ro: "Securitate cibernetică", se: "Cybersäkerhet" },
                { en: "Penetration testing", ro: "Testare de penetrare", se: "Penetrationstestning" },
                { en: "Embedded systems & IoT", ro: "Sisteme încorporate și IoT", se: "Inbyggda system och IoT" },
                { en: "Networked AV & live event production", ro: "Sisteme AV în rețea și producție de evenimente live", se: "Nätverksbaserad AV och liveproduktion" },
            ],
        },
    ],
};

export const branches: BranchEntry[] = [
    {
        id: "kth-ta",
        branch: "EXP/KTH-TA",
        kind: "EXP",
        title: { en: "Teaching Assistant", ro: "Asistent de predare", se: "Lärarassistent" },
        org: kth,
        location: stockholm,
        start: "2026-09",
        end: null,
        tags: [{ en: "Teaching", ro: "Predare", se: "Undervisning" }, { en: "Interaction programming", ro: "Programarea interacțiunii", se: "Interaktionsprogrammering" }, { en: "Web development", ro: "Dezvoltare web", se: "Webbutveckling" }, { en: "Mobile development", ro: "Dezvoltare mobilă", se: "Mobilutveckling" }],
        bullets: [
            same("DM1595 Program Development for Interactive Media"),
            same("DH2642 Interaction Programming and the Dynamic Web"),
            same("ID2216 Developing Mobile Applications"),
        ],
    },
    {
        // The association is named on the CV only; the public site keeps it generic.
        id: "treasurer",
        branch: "EVT/TREASURER",
        kind: "EVT",
        title: { en: "Treasurer", ro: "Trezorier", se: "Kassör" },
        location: stockholm,
        start: "2026-04",
        end: null,
        bullets: [
            {
                en: "Elected treasurer of a local residents' association for the April 2026 – April 2027 term, responsible for the association's finances (annual budget of about 15,000 SEK).",
                ro: "Ales trezorier al unei asociații locale de locatari pentru mandatul aprilie 2026 – aprilie 2027, responsabil de finanțele asociației (buget anual de aproximativ 15 000 SEK).",
                se: "Vald till kassör i en lokal boendeförening för verksamhetsåret april 2026 – april 2027, ansvarig för föreningens ekonomi (årsbudget på cirka 15 000 kr).",
            },
        ],
        tags: [
            { en: "Finance", ro: "Finanțe", se: "Ekonomi" },
            { en: "Budgeting", ro: "Bugetare", se: "Budgetering" },
            { en: "Board role", ro: "Membru în consiliu", se: "Styrelseuppdrag" },
        ],
    },
    {
        id: "kth-msc",
        branch: "EDU/KTH-MSC",
        kind: "EDU",
        title: {
            en: "MSc, Engineering of Distributed Systems",
            ro: "Master, Ingineria Sistemelor Distribuite",
            se: "Masterprogram, Distribuerade system",
        },
        org: kth,
        location: stockholm,
        start: "2025-08",
        end: null,
        tags: [{ en: "Distributed systems", ro: "Sisteme distribuite", se: "Distribuerade system" }],
        bullets: [],
    },
    {
        id: "rn",
        branch: "EXP/RN",
        kind: "EXP",
        title: { en: "Event Technician", ro: "Tehnician de evenimente", se: "Eventtekniker" },
        org: "RN Eventteknik",
        location: stockholm,
        start: "2025-08",
        end: null,
        bullets: [
            {
                en: "Member of a specialised team responsible for end-to-end technical execution of live events, operating professional audio, lighting and stage infrastructure.",
                ro: "Membru al unei echipe specializate, responsabilă de execuția tehnică completă a evenimentelor live, operând echipamente profesionale de sunet, lumini și scenă.",
                se: "Medlem i ett specialiserat team med ansvar för hela det tekniska genomförandet av liveevenemang, med professionellt ljud, ljus och scenteknik.",
            },
            {
                en: "Configure and deploy networked AV systems, ensuring stable signal routing and hardware synchronisation for high-attendance productions.",
                ro: "Configurez și instalez sisteme AV în rețea, asigurând rutarea stabilă a semnalului și sincronizarea echipamentelor pentru producții cu public numeros.",
                se: "Konfigurerar och driftsätter nätverksbaserade AV-system med stabil signalrouting och hårdvarusynkronisering för produktioner med stor publik.",
            },
            {
                en: "Lead real-time troubleshooting of technical failures in high-pressure environments, maintaining system uptime and production quality.",
                ro: "Coordonez depanarea în timp real a defecțiunilor tehnice sub presiune, menținând funcționarea sistemelor și calitatea producției.",
                se: "Leder felsökning i realtid av tekniska fel under press och säkerställer systemens drift och produktionens kvalitet.",
            },
            {
                en: "Maintainer of Backstage2, the organisation's internal booking and bookkeeping software (Next.js, TypeScript, Knex/Objection.js, PostgreSQL, Heroku): added KTH access card (NFC) login, restricted to trusted devices through Cloudflare mutual TLS (mTLS) client certificates.",
                ro: "Maintainer al Backstage2, aplicația internă de rezervări și contabilitate a organizației (Next.js, TypeScript, Knex/Objection.js, PostgreSQL, Heroku): am adăugat autentificarea cu cardul de acces KTH (NFC), permisă doar de pe dispozitive de încredere prin certificate client Cloudflare mutual TLS (mTLS).",
                se: "Förvaltare av Backstage2, organisationens interna boknings- och bokföringssystem (Next.js, TypeScript, Knex/Objection.js, PostgreSQL, Heroku): lade till inloggning med KTH-passerkort (NFC), begränsad till betrodda enheter med klientcertifikat via Cloudflare mutual TLS (mTLS).",
            },
        ],
        tags: [{ en: "Live audio", ro: "Sunet live", se: "Liveljud" }, { en: "Lighting", ro: "Lumini", se: "Ljus" }, { en: "Networked AV", ro: "AV în rețea", se: "Nätverks-AV" }, "Next.js", "TypeScript", "PostgreSQL", "Cloudflare mTLS"],
        links: [{ label: "github.com/rneventteknik/backstage2", href: "https://github.com/rneventteknik/backstage2" }],
        milestones: [
            {
                date: "2026-05",
                text: {
                    en: "Promoted: Aspirant Member → Full Member",
                    ro: "Promovat: membru aspirant → membru cu drepturi depline",
                    se: "Befordrad: aspirant → fullvärdig medlem",
                },
            },
            {
                date: "2026-09",
                text: {
                    en: "Became a maintainer of Backstage2 (KTH card login)",
                    ro: "Maintainer al Backstage2 (autentificare cu cardul KTH)",
                    se: "Blev förvaltare av Backstage2 (inloggning med KTH-kort)",
                },
            },
        ],
    },
    {
        id: "park",
        branch: "PRJ/PARK-TICKETS",
        kind: "PRJ",
        title: {
            en: "Park Admission Ticketing System",
            ro: "Sistem de ticketing pentru intrarea în parc",
            se: "Biljettsystem för parkentré",
        },
        start: "2025-01",
        end: null,
        tags: ["WordPress", "WooCommerce", "PHP", "Java Swing", { en: "Payment gateway", ro: "Procesator de plăți", se: "Betallösning" }, { en: "QR codes", ro: "Coduri QR", se: "QR-koder" }, "Google Wallet", "DNS"],
        bullets: [
            {
                en: "Develop and maintain a production e-commerce platform selling admission tickets for Parc Dumbrava Minunata (WordPress, WooCommerce, PHP).",
                ro: "Dezvolt și întrețin o platformă e-commerce în producție care vinde bilete de intrare pentru Parcul Dumbrava Minunată (WordPress, WooCommerce, PHP).",
                se: "Utvecklar och förvaltar en e-handelsplattform i produktion som säljer entrébiljetter till Parc Dumbrava Minunata (WordPress, WooCommerce, PHP).",
            },
            {
                en: "Built a custom checkout flow and ticket generator module in PHP, enabling on-site access control through offline ticket verification.",
                ro: "Am construit un flux de checkout personalizat și un modul de generare a biletelor în PHP, permițând controlul accesului la fața locului prin verificarea offline a biletelor.",
                se: "Byggde ett eget kassaflöde och en biljettgenerator i PHP som möjliggör passerkontroll på plats genom offline-verifiering av biljetter.",
            },
            {
                en: "Integrated a bank payment gateway through its official WooCommerce plugin, including online payment confirmation and transaction validation logic.",
                ro: "Am integrat procesatorul de plăți al unei bănci prin pluginul oficial WooCommerce, inclusiv confirmarea online a plăților și logica de validare a tranzacțiilor.",
                se: "Integrerade en banks betallösning via dess officiella WooCommerce-plugin, inklusive betalningsbekräftelse online och validering av transaktioner.",
            },
            {
                en: "Designed secure, tamper-resistant QR codes for ticket authentication and fraud prevention, optimised for low processing power.",
                ro: "Am proiectat coduri QR securizate, greu de falsificat, pentru autentificarea biletelor și prevenirea fraudei, optimizate pentru dispozitive cu putere de procesare redusă.",
                se: "Designade säkra, manipuleringsskyddade QR-koder för biljettautentisering och bedrägeriskydd, optimerade för låg beräkningskraft.",
            },
            {
                en: "Built a desktop ticket scanning application in Java (Swing GUI) for touchscreen devices, supporting external QR code scanners and Google Wallet integration.",
                ro: "Am construit o aplicație desktop de scanare a biletelor în Java (interfață Swing) pentru dispozitive cu ecran tactil, cu suport pentru scanere QR externe și integrare Google Wallet.",
                se: "Byggde en skrivbordsapplikation för biljettskanning i Java (Swing-gränssnitt) för pekskärmar, med stöd för externa QR-skannrar och integration med Google Wallet.",
            },
            {
                en: "Manage web hosting, DNS, domain configuration and deployment for secure, reliable operation.",
                ro: "Administrez găzduirea web, DNS-ul, configurarea domeniului și deployment-ul pentru o funcționare sigură și stabilă.",
                se: "Ansvarar för webbhotell, DNS, domänkonfiguration och driftsättning för säker och stabil drift.",
            },
        ],
        links: [{ label: "parcdumbravaminunata.ro", href: "https://parcdumbravaminunata.ro/" }],
    },
    {
        id: "eid",
        branch: "PRJ/EID",
        kind: "PRJ",
        title: {
            en: "Decentralized Identity Management (Thesis)",
            ro: "Managementul descentralizat al identității (lucrare de licență)",
            se: "Decentraliserad identitetshantering (examensarbete)",
        },
        start: "2025-01",
        end: "2025-07",
        tags: ["Java", "Spring Boot", "Next.js", "Node.js", "Solidity", "Ethereum", "OAuth2/OIDC", "DIDs", "Passkeys", "PostgreSQL", "MongoDB", "Docker"],
        bullets: [
            {
                en: "Designed and implemented a decentralised identity federation for cross-border login: users always authenticate at their home country's Identity Provider (IdP), and trust between countries is discovered at runtime instead of through static peering.",
                ro: "Am proiectat și implementat o federație de identitate descentralizată pentru autentificare transfrontalieră: utilizatorii se autentifică mereu la furnizorul de identitate (IdP) din țara lor, iar încrederea între țări este descoperită dinamic, fără acorduri statice.",
                se: "Designade och implementerade en decentraliserad identitetsfederation för gränsöverskridande inloggning: användare autentiseras alltid hos identitetsleverantören (IdP) i sitt hemland, och förtroende mellan länder upptäcks dynamiskt i stället för via statiska avtal.",
            },
            {
                en: "Built a Cross-Identity Gateway (Java 21, Spring Boot WebFlux) that resolves a user's Decentralized Identifier (DID) to their home Country Node.",
                ro: "Am construit un Cross-Identity Gateway (Java 21, Spring Boot WebFlux) care identifică nodul de origine al utilizatorului pe baza identificatorului descentralizat (DID).",
                se: "Byggde en Cross-Identity Gateway (Java 21, Spring Boot WebFlux) som utifrån användarens decentraliserade identifierare (DID) hittar rätt hemnod.",
            },
            {
                en: "Built Country Nodes in Spring Boot (Spring Security OAuth2 Authorization Server, JPA, PostgreSQL) acting as application registries and token issuers; cross-border logins are proxied to the user's home node, which returns scoped, OpenID Connect (OIDC) compliant identity tokens.",
                ro: "Am construit noduri naționale (Country Nodes) în Spring Boot (Spring Security OAuth2 Authorization Server, JPA, PostgreSQL), care țin registrul aplicațiilor și emit tokenuri; autentificările transfrontaliere sunt redirecționate către nodul de origine, care returnează tokenuri de identitate cu permisiuni limitate, conforme OpenID Connect (OIDC).",
                se: "Byggde landsnoder (Country Nodes) i Spring Boot (Spring Security OAuth2 Authorization Server, JPA, PostgreSQL) som fungerar som applikationsregister och utfärdar tokens; gränsöverskridande inloggningar vidarebefordras till hemnoden, som returnerar avgränsade, OpenID Connect-kompatibla (OIDC) identitetstokens.",
            },
            {
                en: "Built a blockchain-backed IdP (Next.js, Prisma, MongoDB, ethers.js): users sign in with an Ethereum wallet (did:ethr), and a keccak256 hash of their identity proof is anchored on Ethereum Sepolia through a Solidity smart contract, without storing personal data on-chain.",
                ro: "Am construit un IdP bazat pe blockchain (Next.js, Prisma, MongoDB, ethers.js): utilizatorii se autentifică cu un portofel Ethereum (did:ethr), iar un hash keccak256 al dovezii de identitate este ancorat pe Ethereum Sepolia printr-un smart contract Solidity, fără a stoca date personale pe blockchain.",
                se: "Byggde en blockchainbaserad IdP (Next.js, Prisma, MongoDB, ethers.js): användare loggar in med en Ethereum-plånbok (did:ethr), och en keccak256-hash av identitetsbeviset förankras på Ethereum Sepolia via ett smart kontrakt i Solidity, utan att personuppgifter lagras på kedjan.",
            },
            {
                en: "Built a legacy-style IdP (Node.js, Express, MariaDB) with OAuth2 Authorization Code + PKCE, OIDC discovery and JWKS, and passwordless passkey (WebAuthn) login, showing compatibility with existing providers.",
                ro: "Am construit un IdP clasic (Node.js, Express, MariaDB) cu OAuth2 Authorization Code + PKCE, OIDC discovery și JWKS, precum și autentificare fără parolă cu passkeys (WebAuthn), demonstrând compatibilitatea cu furnizorii existenți.",
                se: "Byggde en IdP i traditionell stil (Node.js, Express, MariaDB) med OAuth2 Authorization Code + PKCE, OIDC discovery och JWKS samt lösenordsfri inloggning med passkeys (WebAuthn), som visar kompatibilitet med befintliga leverantörer.",
            },
            {
                en: "Containerised all services with Docker Compose and deployed each country on its own virtual machine, provisioned with Multipass and cloud-init.",
                ro: "Am containerizat toate serviciile cu Docker Compose și am rulat fiecare țară pe propria mașină virtuală, configurată cu Multipass și cloud-init.",
                se: "Containeriserade alla tjänster med Docker Compose och körde varje land på en egen virtuell maskin, provisionerad med Multipass och cloud-init.",
            },
        ],
        links: [
            { label: "github.com/bog1200/eid", href: "https://github.com/bog1200/eid" },
            {
                label: "thesis (PDF)",
                href: "https://github.com/bog1200/eid/blob/main/Decentralized%20Identity%20Management%20for%20Web%20Applications%20Using%20Blockchain.pdf",
            },
        ],
    },
    {
        id: "upb",
        branch: "EDU/UPB",
        kind: "EDU",
        title: {
            en: "Engineer's Degree, Information Engineering (taught in English)",
            ro: "Diplomă de inginer, Ingineria Informației (predare în limba engleză)",
            se: "Civilingenjörsexamen, informationsteknik (undervisning på engelska)",
        },
        org: "National University of Science and Technology POLITEHNICA Bucharest",
        location: bucharest,
        start: "2021-10",
        end: "2025-06",
        tags: ["240 ECTS", { en: "Taught in English", ro: "Predare în engleză", se: "Undervisning på engelska" }, { en: "Thesis 9.70/10", ro: "Licență 9,70/10", se: "Examensarbete 9,70/10" }],
        bullets: [
            {
                en: "240 ECTS. Thesis: Decentralized Identity Management for Web Applications Using Blockchain (thesis grade 9.70/10).",
                ro: "240 ECTS. Lucrare de licență: Decentralized Identity Management for Web Applications Using Blockchain (nota lucrării 9,70/10).",
                se: "240 ECTS. Examensarbete: Decentralized Identity Management for Web Applications Using Blockchain (betyg på examensarbetet 9,70/10).",
            },
        ],
    },
    {
        id: "moodle",
        branch: "PRJ/MOODLE-PP",
        kind: "PRJ",
        title: same("Moodle++ – LMS"),
        start: "2024-10",
        end: "2025-06",
        tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "MySQL", "Auth.js", "OAuth2/OIDC", "Cloudflare R2", "S3 API", "Vercel"],
        bullets: [
            {
                en: "Built a prototype of a Moodle-style learning management system (LMS) with Next.js, React and Tailwind CSS, with a MySQL database, Cloudflare R2 object storage for user files and authentication through external identity providers.",
                ro: "Am construit un prototip de platformă de e-learning (LMS) de tip Moodle cu Next.js, React și Tailwind CSS, cu bază de date MySQL, stocare de obiecte Cloudflare R2 pentru fișierele utilizatorilor și autentificare prin furnizori externi de identitate.",
                se: "Byggde en prototyp av en Moodle-liknande lärplattform (LMS) med Next.js, React och Tailwind CSS, med MySQL-databas, objektlagring i Cloudflare R2 för användarfiler och inloggning via externa identitetsleverantörer.",
            },
        ],
        links: [{ label: "github.com/bog1200/Moodle_plus_plus", href: "https://github.com/bog1200/Moodle_plus_plus" }],
    },
    {
        id: "euronews",
        branch: "EXP/EURONEWS",
        kind: "EXP",
        title: { en: "Web Developer Intern", ro: "Web Developer (stagiu)", se: "Webbutvecklare (praktik)" },
        org: "Euronews Romania",
        location: bucharest,
        start: "2024-06",
        end: "2024-08",
        tags: ["Next.js", "React", "Tailwind CSS", "Supabase", "Vercel"],
        bullets: [
            {
                en: "Built web applications with Next.js (React) and Tailwind CSS, using Supabase databases and Vercel cloud deployments.",
                ro: "Am construit aplicații web cu Next.js (React) și Tailwind CSS, folosind baze de date Supabase și deployment în cloud pe Vercel.",
                se: "Byggde webbapplikationer med Next.js (React) och Tailwind CSS, med Supabase-databaser och molndriftsättning på Vercel.",
            },
        ],
    },
    {
        id: "axsys",
        branch: "EXP/AXSYS",
        kind: "EXP",
        title: { en: "Junior PHP Developer Intern", ro: "Junior PHP Developer (stagiu)", se: "Junior PHP-utvecklare (praktik)" },
        org: "Axsys Romania",
        location: bucharest,
        start: "2023-07",
        end: "2023-08",
        tags: ["PHP", "Symfony", "OOP", "Docker", "Docker Compose", "Git"],
        bullets: [
            {
                en: "Developed backend features in PHP using object-oriented programming (OOP) and the Symfony framework.",
                ro: "Am dezvoltat funcționalități backend în PHP folosind programare orientată pe obiecte (OOP) și framework-ul Symfony.",
                se: "Utvecklade backendfunktioner i PHP med objektorienterad programmering (OOP) och ramverket Symfony.",
            },
            {
                en: "Used Docker and Docker Compose for containerised development environments, and Git and GitHub for version control.",
                ro: "Am folosit Docker și Docker Compose pentru medii de dezvoltare containerizate, iar Git și GitHub pentru versionare.",
                se: "Använde Docker och Docker Compose för containerbaserade utvecklingsmiljöer samt Git och GitHub för versionshantering.",
            },
        ],
    },
    {
        id: "dbair",
        branch: "PRJ/DB-AIRLINES",
        kind: "PRJ",
        title: same("DB Airlines"),
        start: "2022-10",
        end: "2023-01",
        tags: ["Angular", "TypeScript", "Express.js", "REST API", "OpenAPI", "Swagger UI", "MySQL"],
        bullets: [
            {
                en: "Designed a MySQL database schema and a RESTful Express.js API (documented with OpenAPI/Swagger UI) for flight booking, with a small Angular front end.",
                ro: "Am proiectat schema unei baze de date MySQL și un API RESTful în Express.js (documentat cu OpenAPI/Swagger UI) pentru rezervarea zborurilor, cu o mică interfață în Angular.",
                se: "Designade ett MySQL-databasschema och ett RESTful API i Express.js (dokumenterat med OpenAPI/Swagger UI) för flygbokning, med ett litet Angular-gränssnitt.",
            },
        ],
        links: [{ label: "github.com/bog1200/DB_Airline_Project", href: "https://github.com/bog1200/DB_Airline_Project" }],
    },
];

export const commits: CommitEntry[] = [
    {
        id: "uipath-ba",
        branch: "CERT/UIPATH-BA",
        kind: "CERT",
        title: same("UiPath Certified Professional Automation Business Analyst Associate"),
        org: same("UiPath"),
        date: "2025-05",
        tags: ["UiPath", "RPA"],
    },
    {
        id: "uipath-dev",
        branch: "CERT/UIPATH-DEV",
        kind: "CERT",
        title: same("UiPath Certified Professional Automation Developer Associate"),
        org: same("UiPath"),
        date: "2025-03",
        tags: ["UiPath", "RPA"],
    },
    { id: "gh-foundations", branch: "CERT/GITHUB", kind: "CERT", title: same("GitHub Foundations"), org: same("GitHub"), date: "2024-12", tags: ["Git", "GitHub"] },
    {
        id: "upm",
        branch: "EDU/UPM",
        kind: "EDU",
        title: {
            en: "Exchange Course: Physical Computing on Open Hardware Platforms (ATHENS, UPM115)",
            ro: "Curs de schimb: Physical Computing on Open Hardware Platforms (ATHENS, UPM115)",
            se: "Utbyteskurs: Physical Computing on Open Hardware Platforms (ATHENS, UPM115)",
        },
        org: same("Universidad Politécnica de Madrid"),
        location: { en: "Madrid, Spain", ro: "Madrid, Spania", se: "Madrid, Spanien" },
        date: "2024-03",
        tags: ["Arduino", "Processing", { en: "Embedded systems", ro: "Sisteme încorporate", se: "Inbyggda system" }],
        bullets: [
            {
                en: "Final grade: 10/10. Embedded systems and physical computing: built Arduino-controlled electronic circuits and interactive interfaces with Processing; final project: Arduino alarm system with sensor integration.",
                ro: "Nota finală: 10/10. Sisteme încorporate și physical computing: am construit circuite electronice controlate de Arduino și interfețe interactive cu Processing; proiect final: sistem de alarmă pe Arduino cu senzori integrați.",
                se: "Slutbetyg: 10/10. Inbyggda system och fysisk databehandling: byggde Arduino-styrda elektroniska kretsar och interaktiva gränssnitt med Processing; slutprojekt: larmsystem på Arduino med integrerade sensorer.",
            },
        ],
    },
    {
        id: "fiicode",
        branch: "EVT/FIICODE",
        kind: "EVT",
        title: {
            en: "FIICode Capture the Flag (CTF) cybersecurity competition, sponsored by Bitdefender",
            ro: "Competiția de securitate cibernetică FIICode Capture the Flag (CTF), sponsorizată de Bitdefender",
            se: "FIICode Capture the Flag (CTF), cybersäkerhetstävling sponsrad av Bitdefender",
        },
        org: { en: "Participant", ro: "Participant", se: "Deltagare" },
        date: "2024-03",
        tags: ["CTF", { en: "Cybersecurity", ro: "Securitate cibernetică", se: "Cybersäkerhet" }],
    },
    {
        id: "cloudflight",
        branch: "EVT/CLOUDFLIGHT",
        kind: "EVT",
        title: same("Cloudflight Coding Contest"),
        org: { en: "Volunteer", ro: "Voluntar", se: "Volontär" },
        date: "2023-10",
        tags: [{ en: "Competitive programming", ro: "Programare competitivă", se: "Tävlingsprogrammering" }],
    },
    {
        id: "best",
        branch: "EVT/BEST",
        kind: "EVT",
        title: same("BEST Engineering Marathon, Accenture Challenge"),
        date: "2022-04",
        tags: ["Hackathon"],
        bullets: [
            {
                en: "Built PetHero, an app for finding missing pets.",
                ro: "Am construit PetHero, o aplicație pentru găsirea animalelor de companie pierdute.",
                se: "Byggde PetHero, en app för att hitta försvunna husdjur.",
            },
        ],
    },
    {
        id: "thm",
        branch: "CERT/THM-JRPT",
        kind: "CERT",
        title: {
            en: "Jr Penetration Tester (ethical hacking, web application security)",
            ro: "Jr Penetration Tester (hacking etic, securitatea aplicațiilor web)",
            se: "Jr Penetration Tester (etisk hackning, säkerhet i webbapplikationer)",
        },
        org: same("TryHackMe"),
        date: "2021-12",
        tags: [{ en: "Ethical hacking", ro: "Hacking etic", se: "Etisk hackning" }, { en: "Web security", ro: "Securitate web", se: "Webbsäkerhet" }],
    },
];
