# Sanity content seed

Repeatable way to add **real** projects (and posts) to the dataset via the CLI.

## How it works

1. Put one JSON document per line in `projects.ndjson` (NDJSON — no commas, no
   array brackets, one object per line). See `projects.example.ndjson` for the
   exact shape.
2. Run the import:

   ```bash
   bun run seed:import          # imports sanity/seed/projects.ndjson into production
   ```

   `--replace` is used, so re-running upserts by `_id` instead of erroring.

Images are referenced by URL with `_sanityAsset` — the importer downloads each
URL and uploads it as a real Sanity asset, so you don't pre-upload anything.

## Real projects workflow (current)

`projects.ndjson` now holds the studio's **real** work (Atik Import Export,
Royal World, Sagando Bungalows, Wooah!, Girit Healthcare, Crypto Predict,
Interactive 3D Portfolio, Untab Studio). Text content is written; images are
added from local files.

1. Drop image files into `images/<slug>/` — see `images/README.md` for the
   naming convention (`hero.*` + gallery files).
2. Wire the local images into the records:

   ```bash
   python3 sanity/seed/inject_images.py
   ```

3. Import:

   ```bash
   bun run seed:import
   ```

### Cleaning up the old test data

Seven placeholder projects still live in the dataset. After the real import
succeeds, delete them (the real **Poster Series** is genuine — keep it):

```
project-lemppa  project-artist-philosopher  project-banking-app
project-edtech-platform  project-messaging-platform  project-logofolio
project-interface-explorations
```

Delete via the Studio (`/studio`) or with `delete_test_data.sh`.

## Project fields (maps to the case-study page)

| Field         | Type        | Shows up as                              | Required |
| ------------- | ----------- | ---------------------------------------- | -------- |
| `title`       | string      | Headline + card title                    | yes      |
| `slug`        | slug        | URL `/work/<slug>`                        | yes      |
| `category`    | reference   | "Type" + card category                   | yes      |
| `year`        | string      | "Date"                                    | rec.     |
| `description` | text        | Card/SEO summary                          | rec.     |
| `about`       | string[]    | "About" paragraphs (one string = one ¶)  | rec.     |
| `services`    | string[]    | "Services"                                | rec.     |
| `timeline`    | string      | "Timeline" (e.g. "2 months")             | opt.     |
| `honors`      | string[]    | "Honor" list                             | opt.     |
| `techStack`   | string[]    | "Stack" list + featured-work tags        | rec.     |
| `image`       | image (URL) | Hero + first media item                   | yes      |
| `cardImage`   | image (URL) | Curated homepage/work card image          | opt.     |
| `previewVideo`| file        | Muted hover preview for animated projects | opt.     |
| `gallery`     | image[]     | Media column (after hero)                 | opt.     |
| `links.live`  | url         | "Visit Site" button                       | opt.     |
| `client`      | object      | name/website (website = Visit fallback)   | opt.     |

Use `image` for the case-study hero. Use `cardImage` for the polished
portfolio tile composition: browser/app frames, colored backgrounds, cropped UI
details, or poster-style artwork. If a project relies on motion, add a short
`.webm`/`.mp4` as `previewVideo`; the card image remains the poster/fallback.

### Category `_ref` values (existing)

- Design: `159be5e7-a4d6-4ea5-ae50-fd4dd0ee87f8`
- Insight: `541287e2-058d-4a5f-ab45-1cfcc5b9ce61`
- Culture: `77dcc9e9-43d1-41f6-968f-288d486ad975`
- Development: `7af5d9be-dfe5-4459-9e3f-857c808f847b`
- Productivity: `9311369a-87fc-4fd4-8bc1-2dfec64ee941`
- Tech: `e698ea05-7c89-4b7a-96cf-d96cf25f8229`

Author "Untab Team": `bbdbf6dd-1cae-4897-889c-7f0df1c136b8`
