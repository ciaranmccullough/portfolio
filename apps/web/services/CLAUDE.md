# `apps/web/services` — service layer guide

A **service** is the project's gateway to one external API / integration, and the
_only_ place that talks to that API. Everything above a service works with clean
domain entities; services speak the API's raw shapes.

## Structure — one folder per service

```
services/<service>/
└── <service>.ts     # client + Request types + Response types + the service
```

Each external API gets its own folder; its `<service>.ts` holds, in order:

1. **Client** — the API client instance the calls use (the Contentful CDA
   client, or a shared Axios/fetch instance). Server-only: never expose secrets
   to the browser.
2. **Request** — typed inputs for the calls (params / query / body). Omit when a
   call takes no input (as our fixed-query Contentful reads do).
3. **Response** — the **raw** API response shapes (DTOs), named `Raw*` /
   `*Response`, exactly as the API returns them (provider field names + casing).
4. **Service** — `async` functions that call the API and return Response DTOs.
   They do **no** reshaping; that is the mapper's job.

## Rules

- **Raw in, raw out.** A service returns Response DTOs, never domain entities.
- **Request / Response types live in the service file** — they are the API
  boundary. **Domain entities live in `apps/web/types`.** A `mapper`
  (`apps/web/mappers`) converts a Response DTO → a domain entity; a data-access
  function (`apps/web/lib`) or hook (`apps/web/hooks`) composes fetch + map
  (+ caching / fallback).
- Services may **throw**; the layer above (data-access) decides how to recover.

## Flow

```
services/<svc>/<svc>.ts   raw API call -> Response DTO
        ↓
mappers/<x>Mapper.ts      Response DTO -> domain entity (types/)
        ↓
lib/<x>.ts (or hooks/)    compose + cache + fallback
        ↓
page / component          clean entity
```

## Reference: `contentful`

`services/contentful/contentful.ts`

- **Client** — `contentfulClient` (CDA) + `hasContentfulCredentials`.
- **Response** — `RawHeroFields` (raw "project" entry fields).
- **Service** — `fetchHeroEntry()` → `RawHeroFields | null`, `fetchEntryCount()`
  → `number | null`. (No Request types — these reads are parameterless.)

`mappers/heroMapper.ts` maps `RawHeroFields` → the `Hero` entity
(`types/hero.ts`); `lib/contentful.ts` composes them (ISR cache + fallback).
