---
title: "CSS without Preprocessors"
date: 2018-01-04T17:11:29+01:00
---

So last week I tweeted this:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Honestly, CSS has gotten so much easier compared to 10 years ago. <br><br>If you&#39;ve always been convinced you can&#39;t do CSS; I dare you to give it a try now! If you&#39;re scared to try it; let me know how I can help. I&#39;m working on putting together a workshop for just this occasion! 😬🔥🔥</p>&mdash; Luc Princen (@LucP) <a href="https://twitter.com/LucP/status/946838199556558848?ref_src=twsrc%5Etfw">December 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

It got some interesting responses ranging from people agreeing with me and mentioning Flexbox and Css Grid as technologies that made it easier for them. It also got a few responses of people disagreeing with me because of the hassle that is frontend tooling. Especially in teams and with git-workflows it can bring about a world of hurt:

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">90% of our merge conflicts occur due to minified Sass files via Gulp in two parallel branches.<br><br>Yay.</p>&mdash; Mario Peshev (@no_fear_inc) <a href="https://twitter.com/no_fear_inc/status/947177734861619200?ref_src=twsrc%5Etfw">December 30, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This got me thinking; would I start a project with bare-bone CSS now? And how would I go about doing it? 

So in this blogpost I'll explore how you might replace preprocessors all together and work with modern CSS without all the hassle of Gulp, NPM and terminal. We'll devide this up into the three parts I -mostly- use Sass for:

1. [Nesting](#nesting)
2. [Variables & Mixins](#variables-mixins)
3. [Prefixing & Minifying](#prefixing-minifying)

---

## Nesting

![Sass nesting compiled to regular CSS](/images/sass.png)
I love being able to nest my CSS, but the truth is; since I'm using grid, I usually only need to nest like one level deep. Even so; [nesting deeper is probably bad practise.](https://css-tricks.com/forums/topic/sass-best-practices-nesting-more-than-3-levels-deep/)

Consider [this codepen example](https://codepen.io/lucprincen/full/NXadKO/) (pictured below):

![Example of a CSS Grid layout](/images/layout.png)

It's got quite a lot going on. It contains a full fledged layout, some cards and some fancy alignment. But look at the Sass I wrote: I only nested five elements. This could easily be done in regular ol' CSS, without the hassle we've mentioned before. 

The point being that, with more semantic markup comes the automatic luxury of not having to nest your CSS that much anymore.

---

## Variables & Mixins

Variables in Sass help me with consistency in fonts, colors and sizes. Mixins I use mostly to add prefixes (more on that later), calculating stuff and avoiding repetition.

Modern CSS has a solution for almost all of these functionalities. To replace Sass variables we could just [use CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) (or, as they are more widely know; Css variables). Let's take a look at how that works:

{{< highlight css >}}
:root{
  --error: #9D3449;
  --primary-font: 'Helvetica Neue';
}
    
div.error{
  display: block;
  background: var( --error );
  font-family: var( --primary-font );
}
{{< /highlight >}}

Here we see how you can define global variables and how to use them. You might be surprised to learn [that this technique works in almost 77% of browsers world wide](https://caniuse.com/#search=css%20variables).

Calculating and repeating can be done natively in CSS as well using `calc()` and `repeat()`:
{{< highlight css >}}
div.error{
    width: calc( 100% - 30px );
    display: grid;
    grid-template-columns: repeat( 4, 1fr );
}
{{< /highlight >}}

Here we make sure our error container isn't taking up the full 100% width of it's parent, but rather leaves 30px, and we devide the container up into four columns, each 1 fraction long.

Now, I can hear you thinking:

> "Meh. I need to support Internet explorer"

I totally get you. I need to support IE as well. Luckily `calc()` and CSS Grid (with `repeat()`) have support for Internet Explorer up untill IE9, but CSS Variables aren't supported in any of the 'splorers... 

I though a bunch on how to create the same effect our CSS variables and mixins where having on our workflow and porting it to our vanilla CSS version and I think the main solution is to use snippets (or emmit) in your editor of choice. Personally, I really like [Visual Studio Code](https://code.visualstudio.com/), but modern editors like [Atom](https://atom.io/) and [SublimeText 3](https://www.sublimetext.com/3) all have the option to create snippets.

![Snippet preview](/images/snippets.gif)

With the right packages we can even add snippets per project. Here are some packages I've found:

**[Visual Studio Code - Project Snippets](https://marketplace.visualstudio.com/items?itemName=rebornix.project-snippets)**
This option is actually perfect for our problem: project related snippets are added to the __/snippets__ directory in your project.

**[Atom](https://atom.io/packages/modular-snippets)**
Just like the Visual Studio Code package, this Atom module uses the __/snippets__ folder to store your custom project snippets. 

The idea is that you create a snippet for each color or font you'd like to include in your project:

{{< highlight json >}}
    "Error Color": {
		"prefix": "$error",
		"body": "#9D3449"
	},
    "Primary font": {
		"prefix": "$primary-font",
		"body": "'Helvetica Neue'"
	}
{{< /highlight >}}

In practice this works really well, as you can see:
![Sass replaced with snippets](/images/sass-replace.gif)


---

## Prefixing & Minifying
A lot of build tools I see prefix and minify the output code right from the start. This is a bit redundant if you think about it; You're probably working on a modern browser and a local development environment. Why would you need prefixes and minification?

Nevertheless; when the time comes to test your code on multiple platforms, I feel -at least- prefixing is very handy. The big thing is; this doesn't have to be automated at all, if you know what you're doing. 

There are plenty of CSS minification and prefixing tools out there, but my current favorite is the [online version of pleeease](http://pleeease.io/play/). This also calculates REM and handles new stuff like CSS Grid really well. 

If you wish to automate your prefixes more, [packages in editors might very well be your best bet](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-autoprefixer) at this point.

---

## Conclusion

The changes in CSS and modern editors allow you to replace a whole lot of preprocessor features right now. That being said; If you've got a workflow setup with preprocessors and you're not having problems with it; by all means keep using them. 

For teams considering a switch to a different workflow, dropping preprocessors all together is actually a viable option right now. If you have any more tips to share, please leave them in the comments. 




