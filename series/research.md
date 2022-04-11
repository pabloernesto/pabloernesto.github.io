---
layout: series_page
series: research
---
{% comment %}
These are the posts in the "{{ page.series }}" series:

{%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
{% assign posts = site.posts
    | reverse
    | where: "series", page.series %}
{% for p in posts %}
- {{ p.date | date: date_format }} [{{ p.title }}]({{ p.url }})
{% endfor %}
{% endcomment %}
