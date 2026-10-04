# Alba House — hotel website

A four-page hotel site in plain HTML, CSS and a little vanilla JavaScript.
No frameworks, no build step, no backend. Open `index.html` and it works.

| Page | File | What is on it |
| --- | --- | --- |
| Home | `index.html` | Auto-playing full-width background gallery with a white headline panel, Book now and WhatsApp buttons, room preview, amenities, photo preview |
| Rooms & amenities | `rooms.html` | One block per room, amenity icons, rates table ready for prices |
| Gallery | `gallery.html` | Masonry grid with category filter, opens in a lightbox |
| Contact | `contact.html` | WhatsApp, email and phone links, enquiry form, Google map |

> **Sample content.** The hotel name, address, phone number, email, room names,
> sizes and opening times are placeholders written for this design. Replace them
> with the real details using the steps below before the site goes live.

---

## 1. Folder layout

```
index.html  rooms.html  gallery.html  contact.html
css/styles.css      all styling (colours and fonts are at the top)
js/main.js          slideshow, menu, lightbox, enquiry form, map
fonts/              the two typefaces, hosted with the site
images/             favicon; put your own photos here
```

## 2. Preview it

Double-click `index.html`. It opens in your browser straight from the folder.
An internet connection is needed only for the sample photos and the map.

## 3. Put in your own details

Open the four `.html` files in any text editor (Notepad, VS Code, TextEdit) and
use **Find and replace in all files** for each line below.

| Find | Replace with | Notes |
| --- | --- | --- |
| `Alba House` | Your hotel name | Also appears in page titles and descriptions |
| `910000000000` | Your WhatsApp number | Country code + number, digits only, no `+` or spaces |
| `+91 00000 00000` | Your number as guests should read it | |
| `stay@albahouse.example` | Your email address | |
| `14 Lake Road, Udaipur,` | First line of your address | Footer and contact page |
| `Rajasthan 313001, India` | Second line of your address | |
| `Udaipur,+Rajasthan,+India` | Your address with `+` for spaces | Sets the map pin, `contact.html` |

The enquiry form reads the WhatsApp number and email from one line in
`contact.html` (the `<form ... data-whatsapp="..." data-email="...">` tag), so
the find-and-replace above updates the form too.

## 4. Change text

All text is ordinary HTML. Find the sentence in the file, type over it, save,
refresh the browser. Keep the tags (`<p>`, `<h2>`, `<li>`) around the words.

Each page also has a `<title>` and a `<meta name="description">` near the top.
These are what Google shows in search results, so update them when you change
what a page says. `index.html` has a small block marked `application/ld+json`
with the hotel's name, address and phone for search engines: update it too.

## 5. Change photos

The sample photos are free-to-use images from Unsplash, loaded from Unsplash's
image service at the exact size each screen needs.

**To use your own photo:**

1. Resize it first. 1920 px wide is plenty for the home page slides, 1200 px for
   room photos, 900 px for gallery tiles. Save as JPG or WebP, ideally under
   300 KB (the free site squoosh.app does this in the browser).
2. Put the file in the `images/` folder, for example `images/pool.jpg`.
3. In the HTML, find the `<img>` you want to change and:
   - set `src="images/pool.jpg"`
   - **delete** the `srcset="..."` and `sizes="..."` lines of that image
   - update `alt="..."` to describe the new photo in a few words
   - on the home page slides, slides 2 onward use `data-src` and `data-srcset`
     instead of `src` and `srcset`: change `data-src`, delete `data-srcset`

**Home page slideshow:** each slide is one `<img class="hero__slide">` inside
`<div class="hero__slides">` in `index.html`. Copy a whole `<img>` tag to add a
slide, delete one to remove it. `data-caption` is the line shown at the bottom.
To change how long each photo stays, edit `--slide-time: 6s` on the
`<section class="hero">` tag.
If a photo is cut off in the wrong place, add `style="object-position: 50% 100%"`
to its `<img>` tag: the second number chooses which part stays visible
(0% = top of the photo, 50% = middle, 100% = bottom).

**Gallery:** each photo is one `<li> ... </li>` block in `gallery.html`. Copy a
block to add a photo. `href` is the large version shown in the lightbox, `src`
is the small tile, `data-category` decides which filter button shows it
(`rooms`, `bathrooms`, `dining`, `spaces` or `outdoors`).

## 6. Rooms, amenities and prices

- **Add a room:** in `rooms.html`, copy one whole `<article class="room"> ... </article>`
  block and edit the text. Add the same room name as an `<option>` in the Room
  list in `contact.html`.
- **Add an amenity:** copy one `<li> ... </li>` in the Amenities list and change
  the two lines of text.
- **Prices:** the rates table in `rooms.html` (look for `id="rates"`) is ready.
  Replace each `On request` with a price such as `₹4,500`. Copy a `<tr>` row to
  add a room, or add a `<th>` plus one `<td>` per row to add a column.

## 7. Colours and fonts

Open `css/styles.css`. The first block, `:root { ... }`, holds every colour and
size used on the site. Change `--indigo` to recolour all buttons and links at
once.

## 8. Put it online

Upload every file and folder, keeping the structure, to any web host
(cPanel/FTP, Netlify, Cloudflare Pages, GitHub Pages). There is nothing to
install or configure on the server.

---

## What is built in

- **Fast:** one CSS file, one small deferred JS file, self-hosted fonts, the
  first hero photo preloaded, every other image lazy-loaded at the right size,
  and the Google map loaded only when a guest asks for it.
- **SEO:** unique title and description per page, one `<h1>` per page with
  headings in order, semantic HTML5 landmarks, descriptive `alt` text, Hotel
  structured data, social sharing tags.
- **Responsive:** tested at desktop (1920), laptop (1366), tablet (820) and
  mobile (390) widths with CSS Grid and Flexbox.
- **Accessible:** skip link, visible keyboard focus, labelled form fields with
  clear error messages, a pause button on the slideshow, and no automatic motion
  for visitors who have "reduce motion" switched on.
- **No backend:** the enquiry form writes the message and opens WhatsApp or the
  guest's email app. Nothing is stored or sent to a server.
- **Works without JavaScript:** navigation, photos, links and an email version
  of the form all still work.

## Credits and licences

- Photos: [Unsplash](https://unsplash.com/license), free for commercial use, no
  attribution required. Each image address in the HTML contains the Unsplash
  photo ID.
- Fonts: Marcellus and Albert Sans, SIL Open Font License (licence texts are in
  `fonts/`).
- Icons: drawn for this site, free to reuse with it.
