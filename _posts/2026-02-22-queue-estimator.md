---
layout: post
title: "I made a thing! Queue estimator"
---

I was sitting in queue for some city hall paperwork, and I thought to myself:
"I wish I could stretch my legs a little,
but I can't because they could call on me at any minute.
I know how to estimate the remaining time on queue,
and how to build a confidence interval for that number,
I just don't have the time (or inclination) to do the numbers myself.
If only my phone could do this for me..."

So obviously I made the thing.

The result is a really simple [web app](/apps/queue-estimator/index.html)
that measures how quickly the queue is moving along,
estimates your remaining wait time, and tells whether you
can go out for a smoke, or a short walk, or a coffee, or lunch.

It also gives you an upper limit on remaining wait time, so you can call your
spouse/mom/friends and tell them "yeah, I'm doing a thing at *place*;
it'll take *number* minutes."

The app does really simple math, so don't expect miracles.
The app asks for 5 points of data before it'll give you an average time,
and 8 points of data before it'll give you break time estimates.
Additionally, if you don't have at least 5 people ahead of you
by the time you've fed it enough data, the estimates won't be any good.

All said and done,
**you need at least 13 people ahead of you when you start the app
to get any value out of it.**
