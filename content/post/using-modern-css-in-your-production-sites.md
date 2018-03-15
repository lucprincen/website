---
title: "Using modern CSS in your production sites"
date: 2018-03-15T09:52:47+01:00
---

For my "Ditch your Framework" talk I've created the basic outline of a three-step design system that will specifically allow you to use modern CSS standards like CSS Grid to their fullest extend. It's a simple way to bring progressive enhancement into practise. 

In this blog I'd like to flesh-out that design system so you can start using modern CSS in your production sites right now.

---

## The bottom-up design system

The basics of this system adhere to the basics of CSS and HTML in general. Using semantic markup and styling in a cascading manner. It's three phases are:

1. Elements
2. Mobile
3. Scaling up

First, we style a lot of the single elements that will likely find a way in your markup. Then we'll get the site ready for mobile and ancient browsers; the css here needs to be very basic. In the scaling-up phase we start working with a lot more modern CSS.

In this blog we'll explore all of these phases as well as how you're supposed to deal with ancient browsers and clients.

---

## 1. Elements
The 'cascading' part of CSS isn't utilized properly. Especially when looking at modern frameworks like React that encourage inlining or modulizing styles. CSS is and has always been a language that is strongest when taking an holistic view of a project. Meaning the entirety of styling can and should be handled by a single stylesheet. We have lost this in our need for compartimentalization and I think it's time we bring it back.

Which is exactly what we're doing in step 1: we're starting at the bottom. We will only be styling based on html tags. Using classes and IDs are forbidden. This ensures we're only working on the global styling of all these elements.

Now the goal is to broadly style loose elements for the project. This means we're not going to style tagd that are used in layouting like `<section>` or `<article>`. Instead, we'll be looking more at `<p>`, `<strong>` and `<button>` elements. 

To do this we'll start by defining all of our colors and font families as variables. If you're not comfortable working with a css preprocessor, I wrote a [blogpost on how you can still use variables in just vanilla CSS](/post/css-without-preprocessors/).

The variables for this particular website (at time of writing) look like this:

{{< highlight css >}}
$main-font: Tahoma, 'Lucida Grande', Verdana, sans-serif;
$head-font: 'Alegreya', Georgia;

$green: #00b09b;
$apple: #B8D152;
$blue: #3C98B4;
$red: #ff5e62;
$orange: #ff9966;
$black: #2d2d2d;
$code: #272822;
{{</ highlight >}}

For this we'll create a basic page containing most of our typographical elements and other tags like `<code>`:
{{< highlight html >}}

<button>Click me</button>
<strong>This should be bold</strong>
<pre><code> //this is a code block </code></pre>

{{</ highlight >}}

The CSS of this page might look a bit like this:

{{< highlight css >}}
button, a.button{
    padding: .4em .8em;
    background: $blue;
    border: 1px solid darken( $blue, 20% );
    border-radius: 4px;
}

pre > code{
    font-family: monospace;
    background: $code;
    padding: .5em;
    width: 70vw;
    margin: auto;
}
{{</ highlight >}}

Notice that we're using (almost) no classnames yet. These are the broader strokes that will need to work everywhere. Apart from this being a cascading approach, this will also force you to work more with semantic HTML5 tags. There's plenty of reasons to stop with the div-soup currently dominating the web (like accessibility), but this also mostly removes the need for very complex class-name systems that developers need to learn.

The only real exception in this is that I also tend to style a `a.button` tag here as well, just because it's pretty silly to generate a form for a link. I've added the `a` selector first, though, just to make sure we're not putting this on `<div>` or `<span>` elements (because they don't get keyboard-focus, dummy! 😉).

---

## Mobile

Now that we have our smaller elements styled it's time to do some layout! This, again, starts of very basicly and is completely mobile-first. The reasons on [why you should be doing everything mobile first](https://abookapart.com/products/mobile-first) are very well documented. In this case we can add another reason: working mobile first is a bottom-up approach where you start simple and gradually add complexity.

Working in the smallest size possible also prevents you from doing a lot of layout. You simply haven't got the horizontal room to style a lot of elements next to each other, so you'll have to make choices. Most of your horizontally aligned elements will have a width of 100%.

What becomes extra important in this phase is legability and interaction design. This is the version of the website most of our 'ancient browser' users will get to see. So everything in this phase needs to look and perform well. There's a few pointers that you need to take into account:

1. Add hover-states
Even though this is the mobile phase, we still need to add hover-states for our non-mobile visitors that'll get defaulted to this layout.

2. Give paragraphs and other long text a max-width
If the screen-size scales up a width of 100% on your paragraph can become cumbersome. If you stretch that out across a 2560 pixel wide display, reading something will feel like a tennis match. The ideal size for this max-width depends on your font size. You'll want to show about 11 words per line.

3. A lot of interactions can be handled with CSS + Html
Currently we're relying a lot on external Javascript for stuff like tabs, lightboxes, etc. All of these things can be done by just CSS. And they can be done while maintaining support for ancient browsers. All the while sparing you a lot of different JS dependencies. Have a look at [youmightnotneedjs.com](http://youmightnotneedjs.com), an excellent example of functions you can solve with plain ol' CSS.

--- 

## Scaling up.

Hurray! you've made it through the 'boring' parts! This is the place where you get to have fun!
The place where we can start working with CSS Grid, CSS columns, flexbox madness, etcetra! 

This phase is called scaling up because we're literally scaling up the layout with grid, but also because we'll add stuff like animations and let the whole site come to life more.

To make sure our layout defaults back to our mobile view we're going to use feature queries:

{{< highlight css >}}

@supports( display: grid ){

    body{
        display: grid;
        grid-template-columns: auto 10vw 1fr 30vw auto;
        grid-template-rows: 12.5em auto 4em;
        grid-gap: 3.5em 2em;
        grid-template-areas: "header header header header header"
                             "gap-left left main right gap-right"
                             "footer footer footer footer footer";
    }
    
    header{
        grid-area: header;
    }

    ...
{{</ highlight >}}

You can now safely use these technologies and know that everyone not capable of rendering stuff like grid will default back to the mobile version.

The main idea here is that, while we're still fully supporting old browsers, we drop support for keeping the layout the same across browsers. Internet Explorer 6 through 9 will still be able to access all your content and everything will be pleasing to read and interact with. It will, however, look completely different when compared to a modern browser.

That being said; this deal is a whole lot better than what these browsers usually get. YouTube, for instance simply doesn't work from Internet Explorer 8 on up; you'll just get a white screen. 

--- 

## Dealing with clients

Clients who still want their site to be the same everywhere (they still exist) can be pretty easily dealt with. Just explain it to them. That might sound stupendously simple for such a complex issue, but it really is that easy. Whenever we are discussing a new website with a client we always explain that we're using modern standards. These standards will be cheaper for the client and it will speed up both the design and development process the process greatly. We also make sure we explain that we're not excluding anybody. 

The only downside is a tiny percentage of old browser users that will not see the same website. Once you explain how small that percentage actually is, and explain what it will mean to the hourly bill to support that percentage, most clients will approve of this bottom-up workflow. Sure there's always a few that insist (mainly governments that are dealing with stricter rules), but they'll be the exemption in stead of the mainstream (like I'm betting most of your clients are right now).

Design and development are tricky services to sell. Especially to clients who have no idea what they are actually buying. Explaining a client, in an easy way, that the internet is an ever-moving-ever-changing place and that making sure 10 year old browsers know what to do with modern code is very hard, you'll not only show that you are thinking with the client (it is -financially- in their best interest to go along with this), you're also demonstrating expertise and gaining more trust. It's a win-win-win. 
