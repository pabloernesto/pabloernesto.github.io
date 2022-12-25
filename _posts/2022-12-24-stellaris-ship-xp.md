---
layout: post
title: "Hostile Cheese Detected: Farming Ship XP in Stellaris 3.5.3"
---

# Introduction

It is a well-known fact that leaders level up in Stellaris.
Somewhat more obscure is the fact that fleets and armies level up too.

> Rank | XP | Damage | Hull points | Evasion
> :----|:--:|-------:|------------:|--------:
> Regular | 0-99 | 0 | 0 | 0
> Experienced | 100-999 | +10% | 0 | 0
> Veteran | 1000-9999 | +20% | +5% | +5%
> Elite | 10000 | +40% | +10% | +10%
>
> &mdash; Stellaris wiki. [Accessed 2022-12-24](https://stellaris.paradoxwikis.com/index.php?title=Ship&oldid=71699#Ship_rank).

Experienced rank is a gimmie; ships built in a starbase with a fleet academy get 100 XP, and this is cheap enough to throw in without thinking.
Veteran and Elite are much harder to get, but also much stronger.
The difference between Experienced and Elite is +30% base damage (or $$\frac{1.4}{1.1}-1 \approx 27.3\%$$ in real terms).
*Defender of the Galaxy* is +50% damage against the crisis only.
*Galactic contender* is +33% damage against fallen empires and the gate builders.
**Getting your ships to Elite is arguably stronger than an extra ascension perk.**

The problem is that getting a ship to Elite is very difficult.
XP for ships is awarded, exclusively, by *days spent in combat* (there is also a little XP awarded for piracy suppression, but this is one *fiftieth* as much).
And ships need to see *a lot* of action before ranking to Elite.
9900 XP at a rate of 5 per day of combat adds up to 5.5 *years* of non-stop fighting.
In Stellaris, a fight lasts a few months at most, and getting into 30 of those *will* get your precious high-XP ships killed.


# The cheese

So what we are going to do is find ourselves a nice, soft target.
A complete non-threat, like an outpost, science ship, mining station, or lone mining drone[^1].
Then we are going to engage our target... *but our guys are not going to have any guns.*

[^1]: You may not need to find a lone target.
    If your ships have fast enough shield/armor regen to take the fight, go right ahead.
    If find that you do need it but can't find it, consider attacking a group and disengaging to kill off all but one ship.

![](/assets/img/stellaris-ship-xp-2.png)

Once your ships have all reached Elite, disengage and refit them.
It's been reported[^reddit-farming] that ships lose XP when refitting.
Crucially, this seems not to be the case on 3.5.3 (if you can point me to the correct changelog, do get in touch).

[^reddit-farming]: u/CalculusWarrior. *Ship Experience and You.* 2018, Reddit [r/Stellaris](https://www.reddit.com/r/Stellaris/comments/800woe/ship_experience_and_you/). Archived copy [at Archive.org](https://web.archive.org/web/20221224234524/https://www.reddit.com/r/Stellaris/comments/800woe/ship_experience_and_you/).


# Further considerations

![](/assets/img/stellaris-ship-xp-1.png)

I kitted my ships for max armor and armor-regen.
Only later did I realize that this was a dumb decision; shields would have been cheaper and more effective against the ancient mining drone I "fought".
Fortunately, it didn't end up mattering.

There are two reasons to focus on Battleships for this cheese.
First, it takes just as long to level up a Corvette or a Battleship, so it makes sense to level up the strongest ships in your fleet.
Second, Battleships have an easier time tanking shots, since you can give them more shield/armor slots, which increase both their shield/armor pool and regen.

A Trickster admiral and the *Hit and Run* military doctrine reduces the odds of losing a ship to disengagement.
An Engineer admiral could tip the scales if your defence can't quite outpace your target's damage.

While you are training your ships they are not available to fight elsewhere.
Even after disengaging, they go missing for some time.
And then you have to refit them.
My experience is that it takes around 2 years from clicking disengage to having a fighting navy.

Montu Plays has studied[^montu-screen] screening forces and found them not worth it from an economic standpoint.
I don't know whether this cheese swings the balance in the opposite direction.
When a Corvette eats a proton launcher for the cause, it saves more than mere alloys.
Montu's casualty data is not segregated by ship type, a screen *could* reduce Battleship causualties.
If it doesn't, it makes more sense to pad damaged fleets with inexperienced Battleships.

[^montu-screen]: Montu Plays. *Stellaris Are Screening Ships Effective? - Fleet Composition Testing.* 2021, [YouTube](https://youtu.be/B0qZDbw9mqU).


# Closing thoughts

I don't think this is going to be big on multiplayer.
A seven and a half year delay (5.5 in combat, 2 in retrofitting), plus the requirement of finding a soft target to hit, make this strategy way too slow and fragile to be competitive.
I'd love to be proven wrong, though.

Single-player is easy enough that people are beating it on Grand Admiral with no scaling and 25x crisis, so this is probably unnecessary.

Still, it is fun to pull off and makes an otherwise forgotten system shine.
I'm happy I tried it.

Good luck, and happy hunting.
