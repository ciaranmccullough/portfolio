# Contentful "Story" content type — API shape reference

Captured directly from the live Contentful space via the Content Delivery API
(`https://cdn.contentful.com`, environment `master`, space id `79cl1pmk9wt4` —
see `apps/web/.env.local` / `apps/web/lib/contentful.ts`) on 2026-07-10, and
re-verified the same day after three content fixes were made in the CMS
(unpublished `backgroundImage` asset, a `descrition` typo key, an empty
walkthrough image — all now fixed; details inline below). This documents the
**real** response shape so the fetch layer / types for the Story detail page
(`/story/:id`) can be written against actual data, not assumptions. Raw JSON
captured alongside this doc during research: `content_types` list, the
`story` content type definition, the `ea-sports-app` entry, and the
`projects` entry (Home page work grid).

## Content type: `story`

- **Content type id**: `story` (matches "Story" case-insensitively; this is
  the exact id to pass as `content_type=story`)
- **Name**: `Story`
- **Description**: `Story`
- **Display field**: `title`
- **Revision** (at capture time): 3

| Field id           | Name              | Type                               | Required  | Localized | Notes                                                                                                                 |
| ------------------ | ----------------- | ---------------------------------- | --------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| `title`            | Title             | Symbol (string)                    | true      | false     |                                                                                                                       |
| `description`      | Description       | Symbol (string)                    | true      | false     | Short summary/standfirst                                                                                              |
| `role`             | Role              | Symbol (string)                    | true      | false     | e.g. `"Software Engineer"`                                                                                            |
| `platform`         | Platform          | Symbol (string)                    | true      | false     | e.g. `"Android \| Jetpack Compose"`                                                                                   |
| `year`             | Year              | Symbol (string)                    | true      | false     | e.g. `"2024 - Now"` (free text, not a number)                                                                         |
| `brief`            | Brief             | RichText                           | true      | false     | Contentful Rich Text document                                                                                         |
| `titlePrinciples`  | Title Principles  | Symbol (string)                    | true      | false     | Section heading copy                                                                                                  |
| `principles`       | principles        | Object                             | true      | false     | Freeform JSON **array** (same "escape hatch" pattern as `projects.projects` / `about.tabs` / `openSource.openSource`) |
| `titleWalkthrough` | Title Walkthrough | Symbol (string)                    | true      | false     | Section heading copy                                                                                                  |
| `walkthroughs`     | Walkthroughs      | Object                             | true      | false     | Freeform JSON **array**                                                                                               |
| `titleReflection`  | Title Reflection  | Symbol (string)                    | true      | false     | Section heading copy                                                                                                  |
| `reflections`      | Reflections       | Object                             | true      | false     | Freeform JSON **array**                                                                                               |
| `titleRole`        | Title Role        | Symbol (string)                    | true      | false     | Section heading copy                                                                                                  |
| `descriptionRole`  | Description Role  | Symbol (string)                    | true      | false     |                                                                                                                       |
| `backgroundImage`  | Background Image  | Link → Asset (`linkType: "Asset"`) | **false** | false     | Only optional field; resolves via `includes.Asset` — see "Include resolution" below                                   |
| `id`               | Id                | Symbol (string)                    | true      | false     | The slug/identifier field — query entries with `fields.id=<slug>`                                                     |

No field on this content type carries a `validations` array (confirmed by
inspecting the raw content type JSON) — `required`/`type`/`linkType` are the
only constraints the API enforces. There's no `size`/`regexp`/`in` validation
to mine for a stricter TS type.

## The `ea-sports-app` entry — resolved shape

Query used: `GET /entries?content_type=story&fields.id=ea-sports-app&include=10`
→ `total: 1`. `sys.id` (the Contentful entry id, distinct from the `id`
_field_) is `4mLI9qPGYvTOhg8texJGLD` (`publishedVersion: 171`, `revision: 4`
after the content fixes). `sys.locale` is `en-US` (single-locale space;
fields come back as flat values, not `{ "en-US": ... }` maps, since the
query didn't pass `locale=*`).

- **`title`**: `"Bringing Fans Closer to Sports"` — plain string.
- **`description`**: plain string (one paragraph, no markup).
- **`role`**: `"Software Engineer"`.
- **`platform`**: `"Android | Jetpack Compose"` — a single string with a
  literal `|` separator, **not** an array. A UI that wants chips must split
  on `"|"` itself.
- **`year`**: `"2024 - Now"` — free text, not a numeric/date range.
- **`brief`**: Rich Text document. In this entry it contains exactly **one**
  `paragraph` block made of alternating `text` nodes — plain runs and
  `marks: [{ type: "bold" }]` runs. No headings, lists, hyperlinks, quotes,
  or other node types appear in the real data, e.g.:
  ```json
  {
    "nodeType": "document",
    "data": {},
    "content": [
      {
        "nodeType": "paragraph",
        "data": {},
        "content": [
          { "nodeType": "text", "value": "A ", "marks": [], "data": {} },
          {
            "nodeType": "text",
            "value": "purpose built",
            "marks": [{ "type": "bold" }],
            "data": {}
          },
          {
            "nodeType": "text",
            "value": " experience ",
            "marks": [],
            "data": {}
          }
        ]
      }
    ]
  }
  ```
  `apps/web/app/components/RichText/RichText.tsx` already renders this (and
  more node types than actually appear here — headings, lists, quotes, hr,
  hyperlinks, italic/underline/code marks — so it's a superset, safe to reuse
  as-is for `brief`).
- **`titlePrinciples`**: plain string.
- **`principles`**: array of 3 objects, shape `{ title: string; description: string }`:
  ```json
  [
    {
      "title": "Instant, even on launch",
      "description": "Performance came first. …"
    },
    {
      "title": "One system, many surfaces",
      "description": "A shared design system …"
    },
    {
      "title": "Real time, optimistic updates",
      "description": "Live data streams in constantly. …"
    }
  ]
  ```
  (An earlier revision of this entry had the 3rd item's body under a
  misspelled `descrition` key; that's been fixed in the CMS and the live
  data now uses `description` on all 3. Since freeform `Object` fields have
  no schema enforcement, mapping defensively — `description ?? ""` — is
  still wise, matching the style of `mapOpenSource`/`mapProjects`.)
- **`titleWalkthrough`**: plain string.
- **`walkthroughs`**: array of 5 objects, shape
  `{ image: string; title: string; subtitle: string; description: string }`:
  - All 5 items now have `image` as a **plain CDN URL string** baked in at
    write time, e.g.
    `"https://images.ctfassets.net/79cl1pmk9wt4/5dwHa2SGg9jxm5RGpfVV3J/fe7ec78f71503850da5ad2581f15dce2/onboarding.webp?h=250"`.
    (The `"Onboarding"` item briefly shipped with `image: ""` — fixed in the
    CMS; keep the existing `if (!url) return ""` guard style anyway since
    the field is schema-less.)
  - Every URL is absolute with a `?h=250` transform already applied — the
    same pattern `toProjectImageUrl` in `projectsMapper.ts` normalises for
    `projects[].imageUrl` (strip the query, re-append `?w=…&q=…&fm=webp`)
    for crisp `next/image` rendering. The same treatment is wanted here.
  - These are **not** Contentful Asset links (no `sys`/`linkType`), so
    `include` has nothing to resolve for this field — the URL is just a
    string value inside the freeform JSON `Object`.
- **`titleReflection`**: plain string.
- **`reflections`**: array of 3 objects, shape `{ title: string; description: string }`.
- **`titleRole`**: plain string.
- **`descriptionRole`**: plain string (one paragraph).
- **`backgroundImage`**: in the raw JSON the field value is a Contentful
  **Link**, _not_ an inlined asset:
  ```json
  {
    "sys": {
      "type": "Link",
      "linkType": "Asset",
      "id": "6qcRXFyuziCOGQtvLAwg9b"
    }
  }
  ```
  The resolved asset arrives separately in top-level `includes.Asset` (see
  next section). A raw-fetch layer must join `fields.backgroundImage.sys.id`
  against `includes.Asset[].sys.id`; the `contentful` JS SDK (used by
  `services/contentful/contentful.ts`) does this inlining automatically, the
  way `fetchAboutEntry()` already reads `image?.fields?.file?.url`.
- **`id`**: `"ea-sports-app"` — confirms this is the slug field to query by
  (`fields.id=<slug>`), and it round-trips exactly against the Home page's
  `projects[].id` (see below).

## How `include` resolution works for this entry

With `include=10` (well above what's needed), the response now carries a
top-level `includes` object with a single key:

```json
"includes": {
  "Asset": [{
    "sys": { "type": "Asset", "id": "6qcRXFyuziCOGQtvLAwg9b", "locale": "en-US" },
    "fields": {
      "title": "easa",
      "file": {
        "url": "//images.ctfassets.net/79cl1pmk9wt4/6qcRXFyuziCOGQtvLAwg9b/c410a7836a7a510d0295b6fef2df31dd/easa.webp",
        "details": { "size": 39492, "image": { "width": 877, "height": 766 } },
        "fileName": "easa.webp",
        "contentType": "image/webp"
      }
    }
  }]
}
```

Notes on this shape:

- `includes.Asset` holds exactly one asset — the `backgroundImage` target.
  There is **no `includes.Entry`**: the Story links to no other entries, and
  the `principles`/`walkthroughs`/`reflections` `Object` fields contain raw
  JSON (no Links), so `include` has nothing to resolve there. When _nothing_
  resolves at all, the `includes` key is omitted entirely (observed on the
  `projects` entry response) — don't assume it's always present.
- The asset's `file.url` is **protocol-relative** (`//images.ctfassets.net/…`),
  like every other asset URL in this codebase — prefix `https:` before use
  (see `toProjectImageUrl`). `fields.description` is absent on this asset
  (it's optional); `file.details.image` is present only for image content
  types.
- **Failure mode worth coding for**: an earlier revision of this entry
  pointed at this same asset while it was still unpublished. The Delivery
  API did **not** fail the request — it returned `total: 1` with the entry
  intact, left `backgroundImage` as the raw Link, omitted `includes`, and
  added a top-level `errors` array:
  ```json
  "errors": [{
    "sys": { "id": "notResolvable", "type": "error" },
    "details": { "type": "Link", "linkType": "Asset", "id": "…" }
  }]
  ```
  If the asset is ever unpublished again this is exactly what comes back, so
  the fetch layer should treat "link with no matching include" as "no
  image", not as an exception. (Via the `contentful` SDK, an unresolvable
  link surfaces as the field still being a bare `{ sys: Link }` with no
  `fields` — the `image?.fields?.file?.url` optional-chaining pattern in
  `fetchAboutEntry()` handles it.)

## Home "projects" array linkage

Content type `projects` (single entry, `sys.id = a4gN743qxYLSa4N0ihcpn`), one
freeform `Object` field named `projects` — an array of 5 plain objects, each
shaped `{ id, title, description, imageUrl, link, tabs }`:

```json
{
  "id": "ea-sports-app",
  "title": "EA Sports App",
  "description": "Bringing Fans Closer to Sports. …",
  "imageUrl": "https://images.ctfassets.net/79cl1pmk9wt4/6qcRXFyuziCOGQtvLAwg9b/…/easa.webp?h=250",
  "link": "https://easa-web.easports.ea.com/",
  "tabs": ["Android", "Jetpack Compose", "Kotlin"]
}
```

**Confirmed: every one of the 5 project objects carries an `id` field**
(`ea-sports-app`, `ea-racenet`, `portfolio`, `fpl-cup`, `dirt-5`), and
**`"ea-sports-app"` is present** and matches the Story entry's `id` field
exactly — so Home → `/story/ea-sports-app` navigation is fully supported by
the content data today. Only `ea-sports-app` currently has a backing `story`
entry, though; the other 4 ids would 404 a story lookup until entries for
them are authored.

Note the Story's `backgroundImage` asset (`6qcRXFyuziCOGQtvLAwg9b` /
`easa.webp`) is the **same file** as this Home card's `imageUrl` — the story
"background" is currently just the card image (877×766, ~39 KB webp), not a
separate hero-sized asset. Rendering code shouldn't assume wide/hero
dimensions; use Contentful's Image API params (`?w=…&fm=webp&q=…`) to
request the size it needs.

**Code gap (not a Contentful gap):** the existing `RawProject` interface
(`apps/web/services/contentful/contentful.ts`) and the `Project` domain type
(`apps/web/types/project.ts`) do **not** declare this `id` field, and
`mapProjects()` (`apps/web/mappers/projectsMapper.ts`) doesn't map it
through — it's silently dropped today even though Contentful returns it. The
later agent wiring up `/story/:id` navigation from the Home grid needs to add
`id` to `RawProject`, map it in `mapProjects`, and add it to `Project`.

## Oddities / gotchas for the fetch-layer author

1. **`backgroundImage` is optional**, and in the raw Delivery JSON it stays a
   `{ sys: Link }` that must be joined against `includes.Asset` (the SDK
   inlines it for you). If the linked asset is unpublished, the response
   degrades gracefully to a `notResolvable` entry in a top-level `errors`
   array — treat "unresolvable" as "no image", not an error (see the include
   resolution section).
2. **`principles` / `walkthroughs` / `reflections` are freeform `Object`
   fields**, not references to child entries or a Contentful array-of-Links —
   there is nothing for `include` to resolve on them, and no way for
   Contentful's UI/API to enforce their inner shape (no JSON schema
   validation configured). Earlier revisions of this very entry shipped a
   misspelled key (`descrition`) and an empty `image` string — both fixed in
   content now, but the _possibility_ is structural. Trust the mapper, not
   the API, for shape safety: make inner fields optional with fallbacks.
3. **`includes` is omitted entirely when nothing resolves** — don't assume
   `response.includes.Asset` / `.Entry` are present-but-empty (the
   `projects` entry response has no `includes` key at all).
4. **Walkthrough images carry a baked-in `?h=250` transform** (250px tall
   source) — upscaling that into a large layout will look blurry. Strip and
   re-apply Image API params as `toProjectImageUrl` does.
5. **Single locale** (`en-US`), no field is `localized: true` — no need to
   handle a `locale=*` multi-locale shape.
6. **`platform` and `year` are single free-text strings**, not
   arrays/structured data, despite `platform` visually reading like a
   tag list (`"Android | Jetpack Compose"`).
7. This content type + entry were created/published the same day as this
   research (`createdAt`/`updatedAt` 2026-07-10), i.e. it looks purpose-built
   for the upcoming Story detail page rather than long-lived content — expect
   more entries/fields to be added as the feature is built out.

## Raw captures (scratchpad, not committed)

Refreshed 2026-07-10 after the CMS content fixes:

- `content-types.json` — full content types list for the space (9 types)
- `story-content-type.json` — the `story` content type definition alone
- `story-entry.json` — full raw response for
  `content_type=story&fields.id=ea-sports-app&include=10`
- `projects-entry.json` — full raw response for `content_type=projects&include=10`
- `all-assets.json` — full `/assets` listing (12 published assets)
