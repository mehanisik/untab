# UNTAB STUDIO

A high-fidelity digital studio platform engineered for visual precision and technological endurance. Architected with the modern web frontier to deliver high-performance, immersive interfaces.

### CORE INFRASTRUCTURE

| Domain | Technology | Implementation Details |
| :--- | :--- | :--- |
| Framework | Next.js 16 | App Router, Turbopack, Cache Components |
| Foundation | React 19 | React Compiler, Activity, useEffectEvent |
| Styling | Tailwind 4 | Modern CSS-first architecture |
| Motion | GSAP | High-fidelity animations & micro-interactions |
| Content | Sanity.io | Headless content orchestration |
| Management | Bun | Performance-oriented package & script execution |

### SYSTEM ARCHITECTURE

- **app/**
  The primary routing and layout layer. Utilizes Next.js 16 Cache Components to maintain high-efficiency state preservation across server-side transitions.
- **components/**
  Modular interface construction. Atomic components reside within `ui/`, strictly adhering to the studio's geometric standards.
- **integrations/**
  Abstraction layer for third-party service connectivity and state orchestration logic.
- **libs/**
  Domain-specific logic, utility modules, and TypeScript environment definitions.
- **public/**
  High-performance static asset hosting, including Satoshi Variable fonts and optimized media.

### OPERATIONAL LIFECYCLE

**Installation**
Initialize the environment by installing dependencies via the Bun runtime:

```bash
bun install
```

**Development**
Launch the local orchestration server:

```bash
bun run dev
```

**Verification**
Validate code integrity through automated linting and static type analysis:

```bash
bun run lint
bun run typecheck
```

**Build**
Execute the production compilation pipeline:

```bash
bun run build
```

### DESIGN & PERFORMANCE PRINCIPLES

- **Typography Standards**
  Strict utilization of the Satoshi Variable font family to ensure precise geometric presence and legibility across all viewport dimensions.
- **Motion Orchestration**
  Animations are executed via GSAP and coupled with React 19 native features (Activity) to optimize rendering and power consumption.
- **Aesthetic Core**
  Minimalist, high-contrast interfaces characterized by sophisticated grain textures and purposeful micro-interactions.

---

Property of Untab Studio. Unauthorized reproduction prohibited.
