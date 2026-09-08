<div align="center">

# REChain — Frontend

_User-facing React application for the REChain platform._

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Features

- **Property Browsing** — Filter by type, price, availability, and amenities with interactive grid/list views.
- **Property Details** — Comprehensive image gallery, amenities list, and integrated appointment booking via ImageKit.
- **Wallet Connection** — Connect an injected browser wallet (MetaMask, Rabby, Brave) on the property detail page via Wagmi + RainbowKit, targeting Polygon Amoy. Display only — no contract interaction.
- **User Authentication** — Secure sign up, log in, and password recovery.
- **Appointment Booking** — Seamlessly schedule property viewings as a guest or authenticated user.
- **AI Property Hub** — In-browser GPT-4.1 powered search and holistic market analysis (requires local enablement).
- **SEO Optimized** — Built-in structured data generation, sitemap mapping, `robots.txt`, and per-page meta tags.
- **Page Transitions** — Fluid UI animations powered by Framer Motion.

---

## Tech Stack

| Category             | Technology                       |
| -------------------- | -------------------------------- |
| **Framework**        | React 18.3 + TypeScript + Vite 6 |
| **Styling**          | Tailwind CSS v4 + PostCSS        |
| **State Management** | React Context API                |
| **Routing**          | React Router v7                  |
| **HTTP Client**      | Axios                            |
| **Animations**       | Framer Motion                    |
| **Icons**            | Lucide React                     |
| **Wallet / Web3**    | Wagmi v2 + RainbowKit v2 + viem  |
| **Async State**      | TanStack Query v5 (wagmi peer)   |
| **Linting**          | ESLint 9 + typescript-eslint     |

---

## Quick Start

<details>
<summary><strong>1. Installation & Setup</strong></summary>

```bash
npm install
cp .env.example .env
```

Edit `.env` to include your connection parameters.

> **Note:** this repository is the frontend on its own — there is no `frontend/`
> subdirectory to change into, and the backend is not included. See the note on
> `VITE_USE_MOCK_DATA` below.

</details>

<details>
<summary><strong>2. Configure Environment Variables</strong></summary>

Create or edit `.env`:

```env
# Required — points to your backend API
VITE_API_BASE_URL=http://localhost:4000

# Optional — set to "true" to enable AI Property Hub locally
VITE_ENABLE_AI_HUB=true

# Development only — serve local fixtures instead of calling the backend
VITE_USE_MOCK_DATA=true
```

> **Note:** Do not set `VITE_ENABLE_AI_HUB` on Vercel. Leaving it unset disables the aggressive AI Hub fetching on the live site (saving API credits) and presents a localized "run locally" modal instead.

> **`VITE_USE_MOCK_DATA`** — the backend is not part of this repository. Without
> this flag the property detail page renders its error state, because its fetch
> fails. With it, `propertiesAPI.getById` returns a fixture from
> `src/services/mockProperty.ts` so the page (and the wallet card on it) is
> usable locally.
>
> **This must be unset or `false` for any production build.** Vite inlines the
> value at build time, so a deployed site built with it enabled would serve
> fixture data.

</details>

<details>
<summary><strong>3. Run the Development Server</strong></summary>

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

</details>

---

## Page Routing

| Page            | Route              | Description                                              |
| --------------- | ------------------ | -------------------------------------------------------- |
| Home            | `/`                     | Hero section, featured properties, about snippets        |
| Properties      | `/properties`           | Browse catalog with robust interactive filters           |
| Property Detail | `/property/:id`         | Full multimedia details, booking, and wallet connection  |
| AI Property Hub | `/ai-hub`               | Natural language GPT-4.1 search (local environment only) |
| About           | `/about`                | Team overview and company information                    |
| Contact         | `/contact`              | User contact form submission                             |
| Sign In         | `/signin`               | Authenticate user                                        |
| Sign Up         | `/signup`               | Register new user                                        |
| Forgot Password | `/forgot-password`      | Password reset request pipeline                          |
| Reset Password  | `/reset/:token`         | Complete a password reset from an emailed link           |
| Verify Email    | `/verify-email/:token`  | Confirm a new account from an emailed link               |
| Add Property    | `/add-property`         | Submit a user listing (requires auth)                    |
| My Listings     | `/my-listings`          | Manage your own submitted listings (requires auth)       |

---

## Wallet Connection

The property detail page carries a wallet card in its sidebar, built with
**Wagmi v2** and **RainbowKit v2** against **Polygon Amoy** (chain id `80002`).
It connects, shows the truncated address and network, prompts to switch when the
wallet is on another chain, and disconnects. There is no contract interaction.

- **Injected wallets only.** `src/lib/wagmi.ts` uses `createConfig` with the
  `injected()` connector rather than RainbowKit's `getDefaultConfig`, which
  requires a WalletConnect Project ID. Nothing needs configuring to run it.
- **Providers are page-scoped.** `Web3Provider` wraps only the property detail
  page. That page is lazy-loaded, so wagmi and RainbowKit stay in its chunk and
  off the static pages.
- **Testing it** needs MetaMask (or Rabby/Brave) with Polygon Amoy added. Without
  that network, the switch button exercises the "chain not added" (`4902`) path.

`WALKTHROUGH.md` walks the code state by state; `APPROACH.txt` covers the
decisions and trade-offs.

---

## Project Structure

<details>
<summary><strong>Explore Directory Tree</strong></summary>

```text
src/
├── components/
│   ├── ai-hub/           → AI Property Hub functional components
│   ├── common/           → Universal elements (Navbar, Footer, SEO, PageTransition)
│   ├── home/             → Modular Homepage sections
│   ├── properties/       → Filter sidebar, property cards, catalog layouts
│   ├── property-details/ → Gallery, amenities, booking form, ConnectWalletCard
│   ├── reusable/         → Shared primitives (Button with CVA variants)
│   ├── web3/             → Web3Provider (wagmi + react-query + RainbowKit)
│   ├── ui/               → shadcn/ui primitives
│   ├── about/            → About page subsections
│   └── contact/          → Contact interface
├── constants/            → Shared style strings and EIP-1193 error codes
├── contexts/             → Global React Context (e.g., AuthContext)
├── hooks/                → Custom React utilities (e.g., useSEO)
├── lib/                  → wagmi.ts — chain and connector configuration
├── pages/                → Complete route components (Lazy-loaded)
├── services/             → Network interface (`api.ts`) and dev fixtures
├── styles/               → Global CSS and Tailwind configurations
└── utils/                → formatPrice, truncateAddress, walletErrors
```

</details>

---

## Available Scripts

| Script              | Action                                                     |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Launch Vite development server with hot module replacement |
| `npm run build`     | Compile robust production-ready bundle                     |
| `npm run preview`   | Serve and preview the compiled production build locally    |
| `npm run lint`      | Execute ESLint across the project                          |
| `npm run typecheck` | Run `tsc --noEmit` — `build` does not type-check on its own |

---

<div align="center">

**Further Reading**

[APPROACH.txt](./APPROACH.txt)

</div>
