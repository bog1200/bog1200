# Hi, I'm Bogdan

**Software engineer** · MSc student in Distributed Systems and Teaching Assistant at **KTH Royal Institute of Technology** · Stockholm, Sweden

I build full-stack web apps and like the parts most people avoid: identity, payments, and the plumbing that keeps services talking to each other.

```text
$ git log --graph --oneline --branches
* (HEAD -> main) you are here
| * EXP/KTH-TA        Teaching Assistant, KTH                         Sep 2026 – now
| | * EVT/TREASURER   Treasurer, local residents' association         Apr 2026 – now
| | | * EDU/KTH-MSC   MSc, Engineering of Distributed Systems, KTH    Aug 2025 – now
| | | | * EXP/RN      Event technician + backstage2 maintainer        Aug 2025 – now
| | | | | * PRJ/PARK  Park admission ticketing system (production)    Jan 2025 – now
* | | | | |   Merge PRJ/EID: decentralised identity federation (thesis) Jul 2025
* | | | | |   Merge EDU/UPB: Engineer's Degree, POLITEHNICA Bucharest   Jun 2025
```

**Portfolio:** [romail.app](https://romail.app): the full CV as an interactive git graph, in English and Swedish.

## Now

- Studying **Engineering of Distributed Systems** at KTH
- TA for **DM1595** Program Development for Interactive Media, **DH2642** Interaction Programming and the Dynamic Web and **ID2216** Developing Mobile Applications
- Event technician at **RN Eventteknik** and maintainer of [backstage2](https://github.com/rneventteknik/backstage2), its booking and bookkeeping app: added KTH access-card (NFC) login behind Cloudflare mTLS
- Running a **production ticketing platform** (WordPress/WooCommerce, PHP, Java) with bank payments, tamper-resistant QR tickets and an offline scanner app

## Featured projects

| Project | What | Stack |
| --- | --- | --- |
| [eid](https://github.com/bog1200/eid) | My thesis: a decentralised identity federation for cross-border login. Gateway resolves DIDs to home Country Nodes, OIDC tokens, identity proofs anchored on Ethereum. [Thesis PDF](https://github.com/bog1200/eid/blob/main/Decentralized%20Identity%20Management%20for%20Web%20Applications%20Using%20Blockchain.pdf) | Java 21, Spring Boot, Next.js, Node.js, Solidity, Docker |
| [backstage2](https://github.com/rneventteknik/backstage2) | Event booking and bookkeeping for RN Eventteknik. I added KTH access-card login restricted to trusted devices. | Next.js, TypeScript, PostgreSQL, Cloudflare mTLS |
| [Moodle_plus_plus](https://github.com/bog1200/Moodle_plus_plus) | Prototype of a Moodle-style LMS with OAuth login and file storage on R2. | Next.js, Prisma, MySQL, Auth.js, Cloudflare R2 |
| [DB_Airline_Project](https://github.com/bog1200/DB_Airline_Project) | Flight-booking database schema and REST API with OpenAPI docs. | Express.js, MySQL, Angular |
| [romail.app](https://romail.app) | This repo: my portfolio. Aurora shader hero, CV rendered as a git graph, i18n, spam-protected contact form. | Next.js 16, three.js, Tailwind CSS |

## Stack

**Languages:** TypeScript · JavaScript · Java · PHP · Python · C++ · SQL · Solidity
**Web:** React · Next.js · Angular · Tailwind CSS · Node.js · Express · Spring Boot · Symfony
**Data and infrastructure:** PostgreSQL · MySQL · MongoDB · Prisma · Docker · Vercel · Cloudflare
**Identity and security:** OAuth2 · OpenID Connect · passkeys (WebAuthn) · DIDs · penetration testing

**Certifications:** UiPath Automation Developer and Business Analyst Associate · GitHub Foundations · TryHackMe Jr Penetration Tester

## Get in touch

[LinkedIn](https://www.linkedin.com/in/sbogdan701/) · [contact form on my portfolio](https://romail.app/en#contact)

Languages: Romanian (native) · English (C1) · French (A2) · Swedish (A2)

<details>
<summary>About this repository (portfolio source)</summary>

<br>

The code behind [romail.app](https://romail.app): Next.js 16 (App Router), React 19, Tailwind CSS 4 and three.js.

```bash
pnpm install
cp .env.example .env.local   # optional locally: the contact form falls back to Cloudflare's test keys
pnpm dev                     # http://localhost:3000
```

- `src/portfolio/data.ts`: all CV content (en/ro/se); the graph, the page and `/llms.txt` are generated from it
- `src/portfolio/graph.ts`: lays the CV out as a git graph with one lane band per category
- `src/app/[locale]/`: the page, per language (`/en`, `/se`; `/` redirects by browser language)
- `src/app/api/contact/route.ts`: contact form → Discord webhook, protected by Cloudflare Turnstile, a honeypot and rate limiting
- `src/app/llms.txt/route.ts`: the portfolio as Markdown for LLMs

Environment variables are documented in [`.env.example`](.env.example).

</details>
