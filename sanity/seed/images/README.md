# Project images — drop zone

One folder per project (named after its slug). Drop your image files in the
matching folder, then the seed importer picks them up automatically.

## Naming convention

Inside each `sanity/seed/images/<slug>/` folder:

- `hero.jpg` (or `.png` / `.webp`) — the hero image. **One per project.**
- Any other files — become the gallery, in **alphabetical order**.
  Name them `01-*`, `02-*`, … to control order.

Extensions can be `.jpg`, `.jpeg`, `.png`, or `.webp`. Mixed is fine.

## Example

```
sanity/seed/images/atik-import-export/
  hero.png
  01-homepage.png
  02-services.png
  03-contact.png
```

## Folders waiting for images

| Slug                        | Project                 | Live URL to screenshot                          |
| --------------------------- | ----------------------- | ----------------------------------------------- |
| atik-import-export          | Atik Import Export      | https://www.atikexp.com                          |
| royal-world                 | Royal World             | https://shoproyalworld.com                       |
| sagando-bungalows           | Sagando Bungalows       | https://bnglow.vercel.app                        |
| wooah                       | Wooah!                  | https://wooah.vercel.app                         |
| girit-healthcare            | Girit Healthcare        | https://healthcare-automation.vercel.app         |
| crypto-predict              | Crypto Predict          | (dashboard screenshots)                          |
| interactive-3d-portfolio    | Interactive 3D Portfolio| https://mami-portfolio-nu.vercel.app             |
| untab-studio                | Untab Studio            | https://www.untabstudio.com                      |

After dropping files, tell me and I'll run the wiring + import. Or run it
yourself: `python3 sanity/seed/inject_images.py && bun run seed:import`.
