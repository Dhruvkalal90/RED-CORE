# RED//CORE --- Death Note Theme

## Overview

RED//CORE supports a **Death Note-inspired visual theme** while keeping
the existing red-on-black cyber interface.

The theme changes the visual appearance of the dashboard without
changing the core functionality:

-   Digital clock
-   Google search
-   Weather
-   Notes
-   Website shortcuts
-   RED//CORE branding

------------------------------------------------------------------------

# 1. Activate the Death Note Theme

## Step 1 --- Prepare the theme assets

Create a theme assets folder:

``` text
red-core/
├── assets/
│   ├── deathnote-bg.jpg
│   ├── deathnote-logo.png
│   └── ...
│
├── newtab/
│   ├── newtab.html
│   ├── newtab.css
│   └── newtab.js
│
└── manifest.json
```

Recommended background:

-   Dark/black Death Note-inspired atmosphere
-   Red accent lighting
-   Minimal visual clutter
-   High contrast behind the clock and search bar
-   No important artwork directly behind text

------------------------------------------------------------------------

## Step 2 --- Add the theme class

Add a theme class to the `<body>` element in `newtab.html`:

``` html
<body class="death-note-theme">
```

This allows the theme CSS to be enabled without rewriting the existing
dashboard.

------------------------------------------------------------------------

## Step 3 --- Add Death Note theme CSS

Add the following to the bottom of `newtab.css`:

``` css
/* =========================================
   DEATH NOTE THEME
========================================= */

body.death-note-theme {

    background:
        #030303;

    color:
        #e5e5e5;
}


body.death-note-theme .background-image {

    background-image:
        url("../assets/deathnote-bg.jpg");

    background-size:
        cover;

    background-position:
        center;

    filter:
        brightness(0.28)
        contrast(1.25);
}


body.death-note-theme .brand {

    color:
        #ffffff;

    text-shadow:
        0 0 12px rgba(255, 0, 0, 0.35);
}


body.death-note-theme .clock {

    color:
        #ffffff;

    text-shadow:
        0 0 5px rgba(255, 0, 0, 0.9),
        0 0 25px rgba(255, 0, 0, 0.45);
}


body.death-note-theme .panel {

    background:
        rgba(3, 3, 3, 0.82);

    border-color:
        rgba(255, 0, 0, 0.22);
}


body.death-note-theme .panel-header {

    color:
        #d0d0d0;
}


body.death-note-theme .search-box {

    background:
        rgba(3, 3, 3, 0.9);

    border-color:
        rgba(255, 0, 0, 0.28);
}


body.death-note-theme .shortcut {

    background:
        rgba(3, 3, 3, 0.82);

    border-color:
        rgba(255, 0, 0, 0.25);
}


body.death-note-theme .shortcut:hover {

    border-color:
        #ff2020;

    background:
        rgba(255, 0, 0, 0.08);
}
```

Adjust the image filename if your asset has a different name.

------------------------------------------------------------------------

# 2. Optional Theme Toggle

If you want the user to be able to switch between the normal RED//CORE
theme and the Death Note theme, add a button:

``` html
<button id="theme-toggle">
    DEATH NOTE
</button>
```

Then add:

``` javascript
const themeToggle =
    document.getElementById("theme-toggle");

themeToggle.addEventListener(
    "click",
    async () => {

        document.body.classList.toggle(
            "death-note-theme"
        );

        const enabled =
            document.body.classList.contains(
                "death-note-theme"
            );

        await chrome.storage.local.set({
            deathNoteTheme: enabled
        });

    }
);
```

To restore the selected theme when RED//CORE starts:

``` javascript
async function loadTheme() {

    const result =
        await chrome.storage.local.get(
            "deathNoteTheme"
        );

    if (result.deathNoteTheme) {

        document.body.classList.add(
            "death-note-theme"
        );

    }

}

loadTheme();
```

This makes the theme preference persistent.

------------------------------------------------------------------------

# 3. Required Chrome Permission

The theme toggle uses:

``` javascript
chrome.storage.local
```

Make sure `manifest.json` contains:

``` json
"permissions": [
    "storage"
]
```

If the weather system is still being used, keep its required permissions
as well.

------------------------------------------------------------------------

# 4. Activate the Updated Theme

After changing the files:

1.  Save all files.
2.  Open:

``` text
chrome://extensions
```

3.  Find **RED//CORE**.
4.  Click **Reload**.
5.  Open a new tab with:

``` text
Ctrl + T
```

The updated theme should now load.

------------------------------------------------------------------------

# 5. Auto-Update Note

## Important

There are two different situations:

### Development / Unpacked Extension

If RED//CORE is loaded using:

**Chrome → Extensions → Developer mode → Load unpacked**

Chrome does **not automatically reload changed source files** as an
installed extension update.

After changing:

-   `manifest.json`
-   JavaScript
-   CSS
-   HTML
-   extension permissions
-   assets

use:

``` text
chrome://extensions
```

and click:

**Reload**

Then open a new tab.

------------------------------------------------------------------------

## Source File Changes

For normal HTML/CSS/JS changes:

``` text
Edit file
    ↓
Save
    ↓
chrome://extensions
    ↓
Reload RED//CORE
    ↓
Open new tab
```

For `manifest.json` or permission changes, always reload the extension.

------------------------------------------------------------------------

# 6. Published Extension Auto-Updates

If RED//CORE is eventually published through the Chrome Web Store,
updates can be distributed through the store.

The normal development workflow is different from the
published-extension workflow:

``` text
DEVELOPMENT

Local files
    ↓
Load unpacked
    ↓
Edit
    ↓
Reload extension
```

``` text
PUBLISHED

New extension version
    ↓
Publish update
    ↓
Chrome Web Store
    ↓
Chrome receives update
    ↓
Extension updates
```

Do not rely on an unpacked extension to automatically update itself.

------------------------------------------------------------------------

# 7. Versioning

When preparing a release, update the version in `manifest.json`:

``` json
{
    "manifest_version": 3,
    "name": "RED//CORE",
    "version": "1.1.0"
}
```

Example version progression:

``` text
1.0.0
│
├── 1.0.1  Bug fixes
├── 1.1.0  New features
├── 1.2.0  More features
└── 2.0.0  Major redesign
```

Keep the version number consistent with your release history.

------------------------------------------------------------------------

# 8. Recommended RED//CORE Theme Structure

``` text
RED//CORE
│
├── Core UI
│   ├── Clock
│   ├── Google Search
│   └── Telemetry
│
├── Utilities
│   ├── Weather
│   ├── Notes
│   └── Shortcuts
│
├── Themes
│   ├── RED//CORE Default
│   └── Death Note
│
├── Assets
│   ├── Backgrounds
│   ├── Icons
│   └── Logos
│
└── Extension
    ├── manifest.json
    └── Chrome Storage
```

## Final workflow

``` text
Edit RED//CORE
      ↓
Save files
      ↓
chrome://extensions
      ↓
Reload
      ↓
Ctrl + T
      ↓
Updated theme / features
```

For the Death Note theme, keep the visual inspiration focused on a dark,
gothic, notebook-and-red-accent aesthetic rather than copying protected
artwork or logos directly.
