# Application Architecture

This document is the source-of-truth orientation guide for the `my-social-media` client. Give it to an AI before asking for new features, API integrations, routes, hooks, components, or refactors. Paths are relative to the repository root.

## 1. System Overview

- **Frontend:** Next.js 16 with the App Router and React 19.
- **Backend:** A separate .NET API. This repository is the client application.
- **Data fetching:** React Query for client-side server state.
- **HTTP:** Axios through `src/shared/api/baseClient.ts`.
- **Authentication:** Account feature store plus `AuthProvider`; the HTTP client attaches and refreshes bearer tokens.
- **Realtime:** SignalR, kept inside the feature that owns the realtime behavior.
- **UI:** React Bootstrap, Bootstrap Sass, reusable shared components, and feature-specific components.
- **Styling:** `src/app/globals.css` plus `src/assets/scss/style.scss` and its Sass partials.
- **State:** React context for cross-cutting UI/application state and Zustand stores for feature state.

## 2. Dependency Flow

The intended request path is:

```text
Route/page UI
  -> feature component
  -> feature hook
  -> feature service
  -> shared/api/baseClient.ts
  -> .NET API
```

For server-only work:

```text
Server Component or server action
  -> src/server/actions, src/server/queries, or src/server/auth
  -> backend/API boundary
```

For realtime work:

```text
Feature component or hook
  -> feature/signalr
  -> SignalR hub in the .NET API
```

Do not call `axios` or `fetch` directly from a page or reusable UI component when the request belongs to the application API. Add or reuse a feature service and route its HTTP request through `baseClient`.

## 3. Repository Root

| Path                | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `src/`              | Application source code.                       |
| `public/`           | Public static files served from the site root. |
| `AGENTS.md`         | Project rules for AI agents and contributors.  |
| `CLAUDE.md`         | Points to `AGENTS.md`.                         |
| `package.json`      | Scripts and dependencies.                      |
| `eslint.config.mjs` | ESLint configuration.                          |
| `next.config.ts`    | Next.js configuration.                         |
| `tsconfig.json`     | TypeScript configuration and path aliases.     |
| `next-env.d.ts`     | Next.js generated TypeScript declarations.     |
| `README.md`         | Basic setup and run instructions.              |

## 4. `src` Directory

### Application routes: `src/app`

This is the Next.js App Router. A folder becomes a URL segment unless it is a route group in parentheses. `page.tsx` renders a route, and `layout.tsx` wraps its descendants.

```text
src/app/
|-- layout.tsx                 Root metadata, global styles, providers, splash screen
|-- page.tsx                   Root page
|-- page.module.css            Root-page CSS module
|-- globals.css                Global CSS
|-- favicon.ico
|-- (auth)/
|   |-- layout.tsx
|   |-- sign-in/page.tsx       Sign-in route
|   `-- sign-up/page.tsx       Sign-up route
|-- (main)/
|   |-- layout.tsx             Main authenticated shell
|   |-- feed/layout.tsx, page.tsx
|   |-- interests/layout.tsx, page.tsx
|   |-- messages/page.tsx
|   `-- notifications/page.tsx
|-- buddies/
|   |-- layout.tsx, page.tsx
|   `-- [id]/edit/page.tsx     Dynamic buddy edit route
|-- courses/layout.tsx, page.tsx
|-- pages/
|   |-- layout.tsx, page.tsx
|   |-- [id]/                  Dynamic page route
|   `-- create/                Page creation route
|-- profile/
|   |-- about/
|   |-- page/                  Profile page area and nested layout
|   `-- user/
`-- settings/
    |-- layout.tsx
    |-- account/
    `-- password/
```

The route folders also contain the nested `page.tsx` and `layout.tsx` files shown by their names. Keep route composition and URL concerns here; keep reusable business logic in `features/`.

### Feature modules: `src/features`

Each feature owns business logic for one domain. Use the existing internal folders where they exist.

```text
src/features/
|-- account/       components, hooks, schema, services, store, types
|-- buddies/       components, hooks, services, types
|-- chat/          components, hooks, signalr, types
|-- courses/       components, hooks, services, types
|-- interests/     components, hooks, services, types
|-- notification/  components, hooks, services, signalr, types
|-- pages/         components, hooks, services, types
|-- post/          components, hooks, services, store, types, utils
|-- profile/       components, hooks, services, types
|-- upload/        services, types
`-- users/         types/user.ts
```

Responsibilities:

- `components/`: UI that is specific to the feature.
- `hooks/`: feature data-fetching and interaction hooks. Use React Query here for API-backed state.
- `services/`: feature API functions and service-level transformations. These call `baseClient`.
- `schema/`: validation schemas, currently used by account.
- `store/`: feature-owned Zustand state, such as authentication or post state.
- `signalr/`: feature-owned SignalR connection and event code. Do not move realtime code to a global folder.
- `types/`: feature request, response, domain, and UI types.
- `utils/`: feature-only helpers, currently used by post.

If a feature does not have a needed subfolder yet, add the smallest appropriate folder inside that feature. Do not create a new top-level feature until the domain is genuinely separate.

### Shared application code: `src/shared`

```text
src/shared/
|-- api/
|   `-- baseClient.ts          Axios instance, API base URL, auth headers, refresh handling
|-- components/
|   |-- layout/                Navbar, panels, auth layout, footer, shared shell pieces
|   |-- ui/                    Reusable UI primitives and widgets
|   |-- wrappers/              AppProvidersWrapper and composition wrappers
|   `-- ...                    Other reusable components
|-- constants/                 App-wide constants, routes, and fixed values
|-- hooks/                     Cross-feature hooks such as usePageId and useToggle
|-- types/                     Cross-feature types such as PageType
`-- utils/                     Cross-feature utility functions
```

A component belongs in `shared/components` only when it is reusable across features or layouts. A component used by one domain belongs in that feature's `components` folder.

### Providers: `src/providers`

- `AuthProvider.tsx`: authentication lifecycle integration.
- `GLightboxProvider.tsx`: lightbox integration.
- `LayoutProvider.tsx`: application layout provider where used.
- `QueryProvider.tsx`: React Query client/provider setup.

`src/shared/components/wrappers/AppProvidersWrapper.tsx` composes the providers used by the root layout. Add a new global provider only when it is truly cross-application; feature-specific providers should remain near the feature.

### Context: `src/context`

- `constants.ts`: context constants.
- `PageContext.tsx`: page-related context.
- `useChatContext.tsx`: chat context hook/provider surface.
- `useLayoutContext.tsx`: navigation, offcanvas, and layout state.
- `useNotificationContext.tsx`: notification state and behavior.

Use context for cross-cutting UI state shared by multiple branches of the tree. Use a feature store for domain state and React Query for server state.

### Server-side boundaries: `src/server`

```text
src/server/
|-- actions/
|   `-- authActions.ts          Server-side mutations/actions
|-- auth/
|   `-- session.ts              Server-side session access
`-- queries/
    |-- getFeed.ts              Server-side feed query boundary
    `-- getProfile.ts           Server-side profile query boundary
```

Server-only logic belongs here. Keep client components from importing server-only modules. Do not place backend implementation code in this repository; the .NET API remains the backend system of record.

### Configuration and utilities

```text
src/config/
|-- env.ts                      Environment access/validation
|-- queryKeys.ts                React Query key definitions
`-- routes.ts                   Route constants

src/helpers/
|-- common-helper.ts
|-- data.ts
`-- menu.ts

src/utils/
|-- change-casing.ts
|-- date.ts
|-- layout.ts
`-- promise.ts

src/lib/
`-- httpsAgent.ts               HTTP/TLS support
```

Use `config/` for application configuration and shared identifiers. Use `helpers/` or `utils/` only for genuinely cross-feature pure helpers; otherwise keep the helper in its feature.

### Legacy or standalone source files at `src` root

These files currently exist outside the feature architecture and should generally be reused only when their existing behavior is required. New domain logic should not be added here.

- `context.ts`
- `delete.tsx`
- `experiencedata.ts`
- `Followers.tsx`
- `LoadContentButton.tsx`
- `Messaging.tsx`
- `People.tsx`
- `SuggestedStories.tsx`
- `useFetchData.ts`
- `useViewPort.tsx`
- `VideoPlayer.tsx`
- `proxy.ts`

The `src/TinySlider/` folder contains the local slider implementation and utilities in `index.tsx` and `utils.ts`.

### Assets and styling: `src/assets`

```text
src/assets/
|-- data/
|   |-- celebrations.tsx
|   |-- layout.ts
|   |-- menu-items.ts
|   |-- notification.tsx
|   |-- other.ts
|   `-- social.ts
|-- images/
|   |-- albums/
|   |-- avatar/
|   |-- bg/
|   |-- elements/
|   |-- events/
|   |-- icon/
|   |-- logo/
|   |-- mockup/
|   |-- post/
|   |-- videos/
|   `-- shared logo/branding image files
`-- scss/
    |-- style.scss
    |-- _custom-react.scss
    |-- _dark-mode.scss
    |-- _user.scss
    |-- _user-variables.scss
    |-- _variables.scss
    |-- _variables-dark.scss
    |-- custom/
    |-- components/
    `-- bootstrap/scss/     Bootstrap Sass source and partials
```

Put imported images, icons, videos, and design data in `assets`. Put global theme or component styling in the existing Sass structure. Do not create a second styling system without a clear reason.

### Types: `src/types`

- `api.ts`: shared API types.
- `component.ts`: shared component/children types.
- `data.ts`: shared data shapes.
- `index.ts`: type exports.
- `menu.ts`: menu types.
- `zuck.js.d.ts`: declaration for the Zuck.js package.

### Public files: `public`

`public` contains files that need direct URL access without importing them through the module graph. Prefer `src/assets` for files imported by React components and `public` for externally addressed static files.

## 5. Where To Add a New File

| Need                                            | Add it here                                             |
| ----------------------------------------------- | ------------------------------------------------------- |
| New URL/page                                    | `src/app/<route>/page.tsx`                              |
| Shared route shell                              | Nearest `src/app/<route>/layout.tsx`                    |
| Authenticated or unauthenticated route grouping | `src/app/(main)` or `src/app/(auth)`                    |
| Feature-specific UI                             | `src/features/<feature>/components/`                    |
| Reusable UI used by multiple features           | `src/shared/components/`                                |
| Feature API call                                | `src/features/<feature>/services/`                      |
| React Query feature hook                        | `src/features/<feature>/hooks/`                         |
| Cross-feature hook                              | `src/shared/hooks/`                                     |
| API client/interceptors                         | `src/shared/api/baseClient.ts` only                     |
| Feature validation schema                       | `src/features/<feature>/schema/`                        |
| Feature Zustand store                           | `src/features/<feature>/store/`                         |
| Feature SignalR connection/events               | `src/features/<feature>/signalr/`                       |
| Feature domain types                            | `src/features/<feature>/types/`                         |
| Cross-feature types                             | `src/shared/types/` or `src/types/`                     |
| Server action                                   | `src/server/actions/`                                   |
| Server query                                    | `src/server/queries/`                                   |
| Session/auth server helper                      | `src/server/auth/`                                      |
| Global provider                                 | `src/providers/` and compose it in the provider wrapper |
| Cross-cutting context                           | `src/context/`                                          |
| Route/config/query-key constants                | `src/config/`                                           |
| Imported image/icon/video                       | `src/assets/images/`                                    |
| Global Sass/theme change                        | `src/assets/scss/`                                      |
| Directly served static file                     | `public/`                                               |

## 6. Rules for AI-Generated Changes

1. Use the App Router. Never create a `pages/` router or use `getServerSideProps` or `getStaticProps`.
2. First identify the owning feature. Put business logic, API services, hooks, types, stores, and realtime code inside that feature.
3. Keep pages thin: compose feature components and hooks; do not put a large API workflow directly in `page.tsx`.
4. Route every .NET API request through `src/shared/api/baseClient.ts`.
5. Keep reusable UI in `src/shared/components`; avoid duplicating Navbar, panels, forms, or controls in route files.
6. Keep SignalR code in the owning feature's `signalr` directory.
7. Respect server/client boundaries. Add `"use client"` only to components that need client hooks, browser APIs, or client state.
8. Reuse `src/config/routes.ts` and `src/config/queryKeys.ts` instead of scattering route strings and query keys.
9. Match nearby naming and export conventions before inventing a new abstraction.
10. After a change, run the narrowest relevant check, then `npm run lint` or `npm run build` when the change affects routing, types, providers, or shared infrastructure.

## 7. Typical API Feature Example

For a new comments API owned by the post domain:

```text
src/features/post/
|-- components/Comments.tsx
|-- hooks/useComments.ts
|-- services/commentsApi.ts
|-- types/comment.ts
`-- ...
```

`commentsApi.ts` imports `baseClient`; `useComments.ts` wraps the service with React Query; `Comments.tsx` renders the result; a route page imports the feature component. If comments later need live updates, add the SignalR connection under `src/features/post/signalr/`.

## 8. Maintenance

Update this file when a new top-level source boundary, feature, provider, route group, or architectural rule is introduced. The exact file inventory should be refreshed when files are added or removed; repetitive image and Bootstrap vendor files are intentionally represented by their category rather than enumerated one by one.
