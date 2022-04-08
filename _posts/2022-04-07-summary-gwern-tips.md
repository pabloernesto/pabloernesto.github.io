---
layout: post
title: "Summary: \"Internet Search tips\" by Gwern Branwen"
tags: summary
---
Branwen, Gwern. Internet Search Tips, 11 December 2018. [https://www.gwern.net/Search](https://www.gwern.net/Search). Accessed: 2022-04-05.

# Why
If memory serves, I learned of Gwern through LessWrong. He was mentioned as a guy who did really careful self-experiments with different drugs. His blog seemed consistently well-researched and earnest (plus he makes and shares some cool data analyses), so I downloaded a copy of his research tips.

# In one paragraph
This article can be read as the field notes of a guerrilla researcher. Apart from search, there is  advice on jailbreaking, cleaning, and redistributing digital texts, as well as scanning and OCRing physical ones. The search advice extends Eco's bibliographic research methodology into the Internet.

# Table of Contents
```
1 Papers
    1.1 Search
        Preparation
        Searching
            Drilling Down
            By Quote or Description
    1.2 Request
    1.3 Post-finding
    1.4 Advanced
2 Web pages
3 Books
    3.1 Digital
    3.2 Physical
4 Case Studies
    4.1 Missing Appendix
    4.2 Misremembered Book
    4.3 Missing Website
    4.4 Speech → Book
    4.5 Rowling Quote On Death
    4.6 Crowley Quote
    4.7 Finding The Right ‘SAGE’
    4.8 UK Charity Financials
    4.9 Nobel Lineage Research
    4.10 Dead URL
    4.11 Description But No Citation
    4.12 Finding Followups
    4.13 How Many Homeless?
    4.14 Citation URL With Typo
    4.15 Connotations
    4.16 Too Narrow
    4.17 Try It
    4.18 Really, Just Try It
    4.19 (Try It!)
    4.20 Yes, That Works Too
    4.21 Comics
    4.22 Beating PDF Passwords
    4.23 Lewontin’s Thesis
5 See Also
6 External Links
7 Appendix
    7.1 Searching the Google Reader archives
        7.1.1 Extracting
            7.1.1.1 Locations
            7.1.1.2 warcat
            7.1.1.3 dd
        7.1.2 Results
8 Footnotes
```

# An alternative outline
*Broadly, how this article reads from my perspective.*

```
1 General search tips
2 Web archival sites
3 Jailbreaking (s3.1)
4 Scanning books (s3.2)
5 Case studies and miscellaneous advice (s4)
```

The organization of this article is terrible. There is a lot of advice on different topics, but no way to find it. If I want all of the advice relevant to web crawling I'd have no choice but to read the whole article. I'll probably extract the information in this article to a more sensible structure. At some point. That will mean rewriting the entire piece, so no promises. Below is one alternative structure.

```
1 Search
    1.1 General advice
    1.2. Specific advice
        1.2.1 By text type
        1.2.2 By source repository
2 Clean
    2.1 Cleaning, OCR, and metadata
    2.2 Jailbreaking DRM'd works
    2.3 Scanning physical books
    2.4 archiver-bot
    2.5 Downloading whole websites (crawling)
3 Share
    3.1 THE GOLDEN RULE: IF IT'S NOT ON GOOGLE, IT DOESN'T EXIST
    3.2 Where to upload
```

# Highlights
*The good, the bad, and the extremely revealing. Direct quotations in no particular order. Some of these ideas may not be discussed at length, but it still seemed worthwile to put them here.*

## Query syntax
> Know your basic Boolean operators & the key G search operators: double quotes for exact matches, hyphens for negation/​exclusion, and `site:` for search a specific website or specific directory of that website (eg. `foo site:gwern.net/docs/genetics/`, or to exclude folders, `foo site:gwern.net -site:gwern.net/docs/`). You may also want to play with Advanced Search to understand what is possible.

(s1.1)

## Custom Search Engines
> [A] Google Custom Search Engines is a specialized search queries limited to whitelisted pages/​domains etc (eg. my Wikipedia-focused anime /​ ​ ​manga CSE).
> 
> A GCSE can be thought of as a saved search query on steroids. If you find yourself regularly including scores of the same domains in multiple searches search, or constantly blacklisting domains with -site: or using many negations to filter out common false positives, it may be time to set up a GCSE which does all that by default.

(s1.4)

## Piracy
> After finding a fulltext copy, you should find a reliable long-term link/​place to store it and make it more findable (remember—if it’s not in Google/​Google Scholar, it doesn’t exist!)

> When in doubt, make a copy. Disk space is cheaper every day. Download anything you need and keep a copy of it yourself and, ideally, host it publicly.

(s1.3)

> [...] if you can find a copy to read, but cannot figure out how to download it directly because the site uses JS or complicated cookie authentication or other tricks, you can always exploit the ‘analogue hole’—fullscreen the book in high resolution & take screenshots of every page; then crop, OCR etc. This is tedious but it works.

(s3.1)

## Visibility
> Adding metadata to papers/​books is a good idea because it makes the file findable in G/​GS (if it’s not online, does it really exist?) and helps you if you decide to use bibliographic software like Zotero in the future. Many academic publishers & LG are terrible about metadata, and will not include even title/​author/​DOI/​year.

> [...] for bonus points, link it in appropriate places on Wikipedia or Reddit or Twitter; this makes people aware of the copy being available, and also supercharges visibility in search engines.

(s1.3)

## Clippings
> [...] regularly making and keeping excerpts creates a personalized search engine, in effect.
> 
> This can be vital for refinding old things you read where the search terms are hopelessly generic or you can’t remember an exact quote or reference; it is one thing to search a keyword like “autism” in a few score thousand clippings, and another thing to search that in the entire Internet!

(s1.4)

# General commentary
This article covers a lot of ground, and it's worth examining carefully. Besides the research advice, there is a clear political and personal message: *Humanity is constantly losing its intellectual heritage. We have collectively accepted this state of affairs as normal, but it's not. It is our own god-damned fault. It's driven by stupidity and greed. Under these conditions, piracy is not just acceptable, but moral and prosocial.*

The single most important idea (besides the political one) is that research requires more than just searching a collection, be it a search engine, library, or academic journal; it requires you to search *for* collections. Learning of a new library, archive, or pirate site is invaluable. Google is not your only option, there are plenty of other search engines, some of which have special collections backing them up.

Search engines mentioned in the article (almost certainly incomplete):
- General: google.com, duckduckgo.com, bing.com
- Books: archive.org, archive.today, books.google.com, libgen.is, HathiTrust, worldcat.org
- Web archival sites: archive.org, timetravel.mementoweb.org
- Academic: scholar.google.com, proquest.com, sci-hub
- Academic, bibliographic only: elibary.ru
- Image-based search: images.google.com, TinEye, Yandex search
- Domain-specific: www.pacer.uscourts.gov (US court documents), PubMed (medical)

Idea number two (number one if you're a writer) is that "if it's not in Google, it doesn't exist". To be considered "shared", you need to be able to find it when you look for it. File metadata is incredibly useful, and yet broadly ignored and infuriatingly hard to manipulate. I'll have to dig up how to insert metadata on this blog.
