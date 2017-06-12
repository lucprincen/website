+++
Description = ""
Tags = ["Development","sass"]
date = "2017-06-12T22:22:24+02:00"
title = "Sass Pixelart"
+++

Last week I watched a fantastic talk by [Una Kravets](https://twitter.com/Una) about creating a CSS game. She hacked together a demo, live on stage, during [CSS Conf EU](https://2017.cssconf.eu/). The thing that got me hooked on the talk was the first part: creating pixelart in CSS by (mis)using box-shadow. 

So tonight I went and did a little exercise of my own to see if I could get it. Here's my version of CSS Pixelart, using a classic "1 Up" from Mario:

<p data-height="440" data-theme-id="0" data-slug-hash="WOxwGB" data-default-tab="css,result" data-user="lucprincen" data-embed-version="2" data-pen-title="Sass Pixel Art" class="codepen">See the Pen <a href="https://codepen.io/lucprincen/pen/WOxwGB/">Sass Pixel Art</a> by Luc Princen (<a href="https://codepen.io/lucprincen">@lucprincen</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Why does this matter?

Obviously this isn't a technique that you'd want to use in a 'real' game. Rendering box-shadow is a hefty thing to do for a browser, so while it makes for a good hacking tool, it's hardly a replacement for a simple bitmap. 

I still found it a great exercise to do, because I got to discover some cool concepts I never bothered about learning in Sass. 
<br/>

<br/>
## Sass Lists & map-get

I have been using Sass for about four years and I never bothered with learning lists and map-get. Sass is a more simpler tool for me; I use it to keep variables and some mixins. I used to use <ins>@extend</ins> a lot but have learned long ago that [this can lead to bad practice](https://www.sitepoint.com/avoid-sass-extend/). 

I can definitely see myself usings lists for generating stuff like multiple (but similar) selectors. If you're like me and haven't tried Sass lists yourself, [Hugo Giraudel has a pretty solid article on the matter.](https://hugogiraudel.com/2013/07/15/understanding-sass-lists/)

<br/>
## Rendering box-shadow

The reason my <ins>.oneup::after</ins> element has a negative <ins>top</ins> and <ins>left</ins> position is because of the way box-shadow is rendered. For some weird archaic reason box-shadow is rendered at the bottom-right corner of a div. Now I have no idea why this is and I can't find any other sources on it. If you know why this is, please leave it in the comments. I love finding out about quirks (which is probably why I like working in CSS 😉)

Anyway; without doodling around with the example above it I would've never know this. 

<br/>
## Learn through play

I've purposefully not explained all techniques in my example because I wanted to urge you to watch Una's talk and see for yourself. I honestly couldn't have done a better job at explaining. Although you might want to rewind some parts because she only has half an hour to create full game 😉

<div style="position:relative;height:0;padding-bottom:56.25%"><iframe src="https://www.youtube.com/embed/WmVH85G59Lk?ecver=2" width="640" height="360" frameborder="0" style="position:absolute;width:100%;height:100%;left:0" allowfullscreen></iframe></div>
<br/>

I missed doing stuff like this over the past couple of years as I got more and more bogged down in my company and the technology it used. It feels good to be having fun again and to learn through basically just farting around. Expect more stuff like this 😉 😍.