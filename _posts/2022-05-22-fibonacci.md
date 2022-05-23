---
layout: post
title: "A brief tour of Scala: two classic problems"
---
# Introduction
A friend of a friend recently referred me for a position at a software development company. Since the company uses Scala a bunch, I've been checking it out. I wanted working knowledge ASAP, so I settled on doing programming katas. Two of these problems turned out to be surprisingly revealing, and well deserving of a post.

# Naive Fibonacci
The Fibonacci sequence is defined recursively:

$$\text{Fibonacci}_1 = 1$$

$$\text{Fibonacci}_2 = 1$$

$$\text{Fibonacci}_n = \text{Fibonacci}_{n-1} + \text{Fibonacci}_{n-2}
    \quad \forall n > 2$$

The natural way to express this as an algorithm is as a recursive function:

```scala
def fib(n: Int): Int = n match {
    case 1 => 1
    case 2 => 1
    case _ => fib(n-1) + fib(n-2)
}
```

This algorithm is correct. For every natural n, it will produce $$\text{Fibonacci}_n$$, given enough time and memory. However, it is terribly inefficient, due to "combinatorial explosion".

```
fib(6)
  fib(5)
    fib(4)
      fib(3)
        fib(2) = 1
        fib(1) = 1
      fib(2) = 1
    fib(3)
      fib(2) = 1
      fib(1) = 1
  fib(4)
    fib(3)
      fib(2) = 1
      fib(1) = 1
    fib(2) = 1
```

To compute `fib(6)`, we have to compute `fib(5)` once, `fib(4)` twice, `fib(3)` thrice, `fib(2)` five times, and `fib(1)` three times. Computing `fib(100)` hangs on my machine.

All these recomputations are pure waste: `fib(4)` is *always* 3, we shouldn't have to ever calculate it more than once. We can cut out this waste by changing our algorithm.

# Iterative Fibonacci
```scala
def iterative_fib(n: Int) = {
  var prev: BigInt = 1
  var curr: BigInt = 1
  for (i <- 3 to n) {
    val next = prev + curr
    prev = curr
    curr = next
  }
  curr
}
```

This is fast, memory efficient, and not terribly difficult to figure out how to write. The problem is that you *have to figure out how to write it.* Creating an iterative algorithm for a recursively defined function is not a trivial task. Fibonacci is pretty simple but it still takes a minute, and you can still make mistakes. Plus, every time you change the recursive definition you need to do some pretty complicated mental gymnastics to figure out how that change affects the iterative algorithm.

# LazyList Fibonacci
Scala has two lazily-defined data structures: the deprecated Stream class, and its replacement LazyList. These provide the "easy" way to do memoization[^what-is-memo] in Scala.

[^what-is-memo]: Memoization is automatic caching. It intercepts every call to a function and stores the answer, ensuring each value is computed at most once. If you see a recursive definition, it's a reasonable bet that memoization will make it go faster. Since it needs to store every call to the memoized function, it can eat up quite a lot of memory.

*Note that I'm starting the sequence at 0 because the stream is 0-indexed. This preserves `fib(1) == 1`.*

```scala
val fib: LazyList[BigInt] = LazyList.from(0).map {
  case 0 => 0
  case 1 => 1
  case x => fib(x-1) + fib(x-2)
}
```

Computed results are stored in memory, so every result is computed *at most* once.

## 3x + 1
There is a quirk to LazyList which severly limits the kind of code we can write. It does not affect Fibonacci, so I'll illustrate with a different problem.

The Collatz conjecture, also known as "3n + 1", states the following:

$$\text{Let } f(m) = \begin{cases}
  n/2 \quad \text{if } 2|n \\
  \text{else} \quad 3n + 1
\end{cases}$$

then for any natural number $$n$$, *it is conjectured* that we can reach $$1$$ by repeated application of $$f$$.

Let's say we want to calculate how many applications of $$f$$ we need to reach 1 from a given n. The recursive definition is super simple: if $$n = 1$$, we don't need to apply $$f$$ at all; otherwise, we calculate $$f(n)$$ once and ask "are we there yet?"

```scala
def f(n) = {
  if (n % 2 == 0)
    n / 2
  else
    3*n + 1
}
val collatz: Int => Int = {
  case 1 => 0
  case n => 1 + collatz(f(n))
}
```

It is relatively straightforward to translate this into the syntax of a LazyList:

```scala
val collatz: LazyList[Int] = LazyList.from(0).map {
  case 0 => 0
  case 1 => 0
  case n => 1 + collatz(f(n))
}
```

The problem with this is that it *doesn't work*: if we try to get the first 10 elements of that list, Scala complains that a "self-referential LazyList or a derivation thereof has no more elements". This is caused by LazyList's big quirk: list elements are computed *in order and without skipping*[^no-skip]. This means that if your code depends on a value further down the track, Scala will throw a fit and refuse to compute anything.

[^no-skip]: Scala's Standard Library documentation, LazyList. [wwww.scala-lang.org](https://www.scala-lang.org/api/2.13.x/scala/collection/immutable/LazyList.html) *"Elements are computed in-order and are never skipped."*

A couple interesting examples:
- Scala is fine calculating `collatz(2)`, since it depends only on `collatz(1)`, causing no forwards-access on the list.
- Scala is *not* fine calculating `collatz(3)`, since it depends on `collatz(10)`, which causes forwards-access.
- Scala is *not* fine calculating `collatz(4)`. This is surprising because it depends only on `collatz(2)` and `collatz(1)`, but remember *Scala never skips*: before calculating `collatz(4)`, it will try calculating `collatz(3)`, causing a forwards-access, crashing the program.

## The weird self-referential version
I came up with the LazyList-based Fibonacci I presented before while working on the implementation of Collatz. The typical way I found Fibonacci done online is some variation of:

```scala
val fib: LazyList[BigInt] = BigInt(0) #:: BigInt(1) #:: fib.zip(fib.tail).map(_+_)
```

This code is... hard to digest. The best I've got is: pretend the Fibonacci numbers have already been constructed *for* you. The list would look something like this:

```
0 1 1 2 3 5 8 13 ...
```

If we add the list to itself shifted over one element we get:

```
0 1 1 2 3  5  8 13 ...  fib
1 1 2 3 5  8 13 21 ...  fib.tail
======================
1 2 3 5 8 13 21 34 ...  fib.zip(fib.tail).map(_+_)
```

Which is just fib, minus the first two elements. Combinatorial explosion is avoided, `fib(100)` finishes in an instant. This demands some *serious* mental gymnastics, so I assume that this form addresses an efficiency concern. Getting to the n-th element of a linked list requires sequential search, my intuition tells me this would avoid that somehow.

# Naively memoized Fibonacci
LazyLists can do the trick, but they are limiting and weird. A much more straightforward method to do caching is to stick a Map in front of our function.

```scala
def memoize[K, V](f: K => V): K => V = {
  val cache = scala.collection.mutable.Map.empty[K, V]
  k => cache.getOrElseUpdate(k, f(k))
}
```

The function signature is slightly wonky: it takes a function from K to V, and returns a different function from K to V. K and V are parameters, so we can memoize functions from Int to Int, from Int to String, from Person to Place, or whatever else we fancy... but try to stick to immutable classes.

There's an important but subtle point to make about line 3: memoize returns a new function that takes some value, k, and returns `cache.getOrElseUpdate(k, f(k))`. `getOrElseUpdate` is designed not to evaluate its second argument unless the value is needed. This is called *non-strict evaluation* and it's not the default behavior for Scala functions. You can write your own non-strict functions using some special notation[^non-strict].

[^non-strict]: Chiusano, Paul, and Rúnar Bjarnason. _Functional Programming in Scala_. Shelter Island, NY: Manning Publications, 2015. ch5.

Now we can create a new function, fast_fib, that caches accesses to the base fib function:

```scala
def fib(n: Int): BigInt = n match {
  case 0 => 0
  case 1 => 1
  case n => fib(n-1) + fib(n-2)
}

val fast_fib = memoize(fib)
```

`fast_fib(n)` only calls `fib(n)` when it doesn't know the answer, meaning that each result is calculated at most once. This... sort of works. `fast_fib(100)` still hangs my machine.

Why? Consider `fast_fib(100)`: if we don't already have the answer in cache, `fast_fib` will call `fib(100)`, which calls `fib(99)` and `fib(98)`. It doesn't even matter if we have `fast_fib(99)` and `fast_fib(98)` already computed, `fib` doesn't know about `fast_fib`, so it doesn't use the cache at all!

However, we *are* on to something. Since Maps don't share LazyList's hardcore take on sequential access, we can memoize `collatz` without causing Scala to blow a fuse. The missing step is to make sure that *recursive* calls also go through the cache.

# var self-reference Fibonacci
*This approach is lifted almost verbatim from "Higher Order Perl"[^hop]. I cannot recommend this book enough. It's the only programming book I can call beautiful with no reservations. It's only shortcoming is that it's about Perl. There's a saying that goes "Python is executable pseudocode. Perl is executable line noise."[^line-noise] ...so I guess I have some reservations, but it's still an incredible read.*

[^hop]: Dominus, Mark Jason. *Higher-Order Perl: Transforming Programs with Programs.* 1st ed. Amsterdam ; Boston, Mass: Morgan Kaufmann Publishers, 2005. *s3.5*

[^line-noise]: I've found multiple crap quotes-sites attributing "Python is executable pseudocode. Perl is executable line noise." to Bruce Eckel. The Internet Archive has a 2001 snapshot of his site that includes the quote among [some notes for a planned book](http://web.archive.org/web/20010410010348/www.mindview.net/Books/Python/ThinkingInPython.html). However some googling yields [a quote collection](http://web.archive.org/web/20220129075431/http://www.gdargaud.net/Humor/QuotesProgramming.html) that also includes it, dated 2000 (beats me how Google dated it, since it doesn't seem to include any date metadata). So Eckel is *probably* a misattribution.

In Scala, calls to fib inside of fib refer to the *symbol* fib. If we define fib as a `var`, then changing fib will change those inner references:

```scala
var fib: Int => BigInt = {
  case 1 => 1
  case 2 => 1
  case n => fib(n-1) + fib(n-2)
}

var oldfib = fib
fib = _ => 1

println(for (i <- 1 to 10) yield(fib(i)))
// prints Vector(1, 1, 1, 1, 1, 1, 1, 1, 1, 1)

println(for (i <- 1 to 10) yield(oldfib(i)))
// prints Vector(1, 1, 2, 2, 2, 2, 2, 2, 2, 2)
// oldfib tries to call fib, not itself!
```

We can use this to force recursive calls to go through the cache:

```scala
var fib: Int => BigInt = {
  case 1 => 1
  case 2 => 1
  case n => fib(n-1) + fib(n-2)
}

fib = memoize(fib)
// now the original code no longer calls itself
```

We can even memoize during the declaration, meaning we don't need var after all.

```scala
val fib: Int => BigInt = memoize {
  case 1 => 1
  case 2 => 1
  case n => fib(n-1) + fib(n-2)
}
```

And once again, it has no issue with collatz:

```scala
def f(n) = {
  if (n % 2 == 0)
    n / 2
  else
    3*n + 1
}
val collatz: Int => Int = memoize {
  case 1 => 0
  case n => 1 + collatz(f(n))
}
```

# Short of the ideal
Var-based (or val-based) memoization works great, but still has a couple of limitations:
1. adding memoization to fib requires *altering* fib (either at the definition, or through mutation)
2. we can't add memoization to fib without access to the fib variable (ie: we can't memoize arbitrary lambdas)

Point two has an obvious practical implication: we can't write a procedure that automatically tests some function f against it's memoized version:

```scala
def test_memo[K, V](f: K => V, k: K): String = {
  // if f is fib, then both versions will suffer
  // from combinatorial explosion. sadly, we have
  // no way of doing real memoization from inside test_memo
  val fast_f = memoize(f)

  val t1 = System.nanoTime()
  f(k)
  val t2 = System.nanoTime()
  fast_f(k)
  val t3 = System.nanoTime()

  s"f took ${t2-t1}ns, fast_f took ${t3-t2}ns"
}
```

What we really want is a version of memoize that works like a pure function should: creating a modified version *without altering the original at all*. This requires the ability to programatically look at and modify arbitrary functions, which, as far as I can tell, Scala doesn't let us do. *But weirdly JavaScript does.*

Try it yourself. Open a js console on your browser and type in this:

```js
function fib(n) {
  return n == 1 ? 1
    : n == 2 ? 1
    : fib(n-1) + fib(n-2)
}
```

You can call `fib(30)` to get the 30th fibonacci number. And you can call `fib.toString()` to get *a String with fib's source code.* This means we can now make a function that takes some other arbitrary function, gets it's source, and checks whether it's recursive. Or (in conjunction to [Function()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)) creates a different function called "memoized_whatever". Or translates it to a different programming language. That is *wild*.

Fibonacci is a classic problem for a reason: it is simple enough a complete novice can understand it, but it has amazing depth and reveals a lot about the capabilities of the language you are working with.
