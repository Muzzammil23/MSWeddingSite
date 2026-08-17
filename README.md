# Wedding Gallery

A responsive single-page wedding photo gallery with:

- Modern wedding-themed landing page
- Responsive masonry-style photo gallery
- Full-screen lightbox / slideshow
- Previous / next navigation
- Keyboard arrow navigation
- Mobile swipe navigation
- Download button for the currently viewed photo
- Lazy-loading for large galleries

## Add your photos

1. Copy your wedding photos into the `photos` folder.
2. On Windows, right-click `update-gallery.ps1` and run it with PowerShell, or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\update-gallery.ps1
```

3. This creates/updates `photos.json` automatically.
4. Serve the folder using a local web server.

For example, if Python is installed:

```powershell
python -m http.server 8080
```

Then open:

`http://localhost:8080`

## Important

Modern browsers do not allow JavaScript on a normal static page to enumerate all files in a local folder automatically. The included `update-gallery.ps1` script solves that by scanning the `photos` folder and generating the `photos.json` manifest used by the website.

## Customise the title

Edit these parts in `index.html`:

- `Our Wedding`
- `Our Wedding in photographs.`
- The introductory sentence
- The `M` inside `.brand__mark`

You can replace these with your names, wedding date, or a short message.
