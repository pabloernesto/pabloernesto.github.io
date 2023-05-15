---
layout: post
title: I made a thing! minimal-notepad
---
I made a thing!
It's an browser based plain-text editor.
It's super basic, tiny (40KB), fast, and it works offline!
You can [use it for free][applink] without ads.

[applink]: /apps/minimal-notepad/

1. TOC
{:toc}



# Introduction
`minimal-notepad` is a very basic plain-text editor, implemented as a web app.
Opening the app automatically installs in onto your phone and it will work even without an internet connection thereafter.
Your notes are autosaved as you type and never leave your browser.

The project was born out of frustration; I wanted something to keep quick little notes on my phone, and it was a pain to find something that was free, fast, worked offline, didn't look terrible, and had *no fucking video ads.*
There are probably ok choices out there, but I was looking for a coding project anyway, so I decided to make my own.

The app was written in plain HTML, CSS, and JavaScript over the space of a month, in collaboration with [Maferep][maferep].
We didn't use a frameworks, transpilers, or server-side code.
The only dependency is [Jake Archibald's IndexedDB Promised][idb] library.

[maferep]: https://maferep.github.io
[idb]: https://github.com/jakearchibald/idb "Source code at GitHub."

`minimal-notepad` is supported for recent versions of Firefox and Chrome, though it stil should work on Safari and Opera (let me know if it breaks for you).



# Prior work
Inspired by Mark Francis' editor Bookmarklet tweet, as seen in Paul, Ian. *Turn Any Browser Tab into a Basic Text Editor.* 2014-06-06, [PCWorld](https://www.pcworld.com/article/2360940/turn-any-browser-tab-into-a-basic-text-editor.html).

Another big inspiration/role model during development was [DevDocs.io][devdocs].
It's an offline documentation browser for software developers, that's everything I aspired `minimal-notepad` to be: free, fast, offline, pretty, and ad-free.
I use it every day.

[devdocs]: https://devdocs.io

For a discussion of technical problems in making web-based rich-text editors, see Medvedev, Ilya. *How To Develop A Text Editor For The Web.* 2022-02-22, [Smashing Magazine](https://www.smashingmagazine.com/2022/02/develop-text-editor-web/)

A similar app is [StackEdit.io][stackedit].
StackEdit is a split-pane Markdown editor, it supports linking images (but not uploading them), adding links between notes, etc.
It is also much, *much* bigger: 3.7MB or *90 times* bigger than `minimal-notepad`.
I've stopped using it because it takes my phone 4 seconds to wake it up from a cold start.

[stackedit]: https://stackedit.io



# How is it made?

## Static site
A non-negotiable point was to keep this app truly free.
Hosting an app can get expensive, even if you're doing it yourself.
There are free tiers to several hosting services, but this is a generous (and likely temporary) concession, I wanted something I could rely on.

Consequently, `minimal-notepad` is a completely static app.
It has no server-side logic except "serve these files", all processing and storage happens in the user's device.
This means it can be hosted on GitHub Pages, along with the rest of this blog.
Serving static files reduces CPU utilization by the host, and small file sizes reduce storage and bandwith needs.
This all reduces costs, which means it taxes GitHub less and, should I need to, makes this practical to self-host.
It's also a big win for privacy.

## Storage
`minimal-notepad` uses IndexedDB to save your notes as you type.
IndexedDB is a relational database and doesn't support partial record updates, so every time you make a change we have to throw away the old version of your note and store it from scratch.
Copying lots of data around every time you type is rather slow, so we only save a few seconds after you've stopped typing.

IndexedDB is not the only mechanism for saving local data on a browser.
By my count, there are five: Cookies, Web Storage, IndexedDB, the File and Directories Entry API, and the File System Access API.
Looking back, using the File and Directories Entry API would have allowed us partial note updates, making it the more appropiate option.
However, it would have also been more complicated to implement.

## Offline access
When we initially tried to make the app work offline, we checked the [online version](http://diveintohtml5.info/) of Pilgrim, Mark. *Dive Into HTML5.*
This led us astray for a while, since it uses Cache Manifest, which is now deprecated.
Service Workers are the only way to make an app accessible offline to modern browsers.
If we had wanted to support older browsers, we would have had to implement both Service Workers and a Cache Manifest.

We use a cache-only caching policy.
This means that the browser automatically checks whether the Service Worker is still the same on the server, and as long as it is, no other files are downloaded.



# The cutting room floor
You can make web apps installable by including an App Manifest.
We didn't set it up due to time restrictions.

There is also no way to change the font size from within the app, though it should respond to changing it from your browser's preferences.

You can't export your notes all together, you have to manually copy and paste them out of the app.



# Lessons learned
From a design perspective, adding multiple note support was a mistake.
I underestimated how many new widgets would have to be added, and how many new interactions would have to be accounted for.

As learning experience, though, it was very fruitful.
For historical reasons, web browsers ship with form inputs (checkboxes, search inputs, etc) that are broken by default.
They are semantic, functional, accessible... but can't be styled, in some cases at all.
It's possible to replace these broken inputs with custom implementations, but making sure that they are stylable, functional, keyboard-accessible, screen-reader accessible, and that they don't introduce subtle problems to the app that uses them is a *lot of work.*
The only sane way to deal with this is a library of carefully crafted, reusable web components.
