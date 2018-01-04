---
title: "Automation with WordPress"
date: 2018-01-06T17:11:29+01:00
draft: true
---

## About frontend tools
Tooling, especially in the CSS-world started to become popular around 2010 in the form of CSS Preprocessors like Less and Sass (although Sass has been around since 2006). 

![Nesting in Sass being compiled to CSS](images/sass.png)

It meant you could start to nest your css and use functions and variables in your stylesheet. These in and of itself weren't files you could add to the frontend of your site; they needed to be compiled. So with the help of a task-runner like Grunt or Gulp you compiled your Sass or Less files into a single CSS file.

It made the process of writing CSS a lot easier and more fluid (in my experience). The difference with regular CSS though is that getting started with these tools was and still is in some ways a huge hurdle. 

--- 
This is especially true, I feel, in the WordPress world. WordPress is (relatively) easy to setup and reconfigure using themes and plugins. Most of the changes you'd need to make will be on the CSS-level. But because getting started is so easy, a lot of the later configuration and deployment stuff gets a lot more complex, unless you're willing to make
