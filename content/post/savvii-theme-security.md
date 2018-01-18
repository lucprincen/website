---
title: "Building secure WordPress themes"
date: 2018-01-04T17:11:29+01:00
draft: true
---

# Building secure WordPress themes
A WordPress theme usually makes up a huge part of the website you're building. Where plugins offer features and behavior, your theme is what your users will be interacting with. So it's no surprise that insecure themes make up a big chunk of all WordPress hacks. In fact; after bad plugins and not updating WordPress core, [it's the most common way to get hacked according to WordFence](https://www.wordfence.com/blog/2016/03/attackers-gain-access-wordpress-sites/).

In this post we'll look at how you can harden the themes you've created. Most of this advice (and the accompanying code) is sourced from personal experience in dealing with hacks.

That being said: security really is more of a mindset than a collection of code or quick fixes. Acording to the [WordPress theme handbook's chapter on theme security](https://developer.wordpress.org/themes/theme-security/) the following principles should be central to your process:

1. Don't trust your data
2. Rely on the WordPress API
3. Keep your themes up-to-date

We'll take these principles into account for this entire blogpost. The post has been broken up in the following chapters:

- [Checking user intent](#checking-user-intent)
- [Validating and sanitizing input](#validate-and-sanitize-input)
- [Escaping output](#escaping-output)
- [Vulnerabilities in your javascript](#vulnerabilities-in-your-javascript)
- [Handing user data](#handling-user-data)
- [Keeping themes updated](#keeping-themes-updated)
- [A final checklist of no-brainers](#a-final-no-brainer-checklist)

In each chapter we'll try to stick to as much default WordPress functions as possible. The reason for this is simple: if WordPress gets updated, these functions get updated. So if there's a new vulnerability discovered, and WordPress core has provided a patch, you can be sure your code is safe as well. It saves you time in updating and a lot of headaches.

Okay. Strap in, because we've got a lot of ground to cover!

---

## Checking user intent
Guessing a users' intent is a tricky thing to get right in both design and development. For the purposes of security though, we finally have a solution in the form of a nonce. A nonce is a randomly generated string that gets send along with a vulnerable request and checked on arrival. Nonce is an acronym for "Number used only once"

In WordPress we can pass along a nonce in a URL or in a form we're submitting. [How to technically implement a nonce](https://codex.wordpress.org/Wordpress_Nonce_Implementation) is discussed in length on the WordPress codex, but when do you apply a nonce?

### When do you apply a nonce?
A nonce is meant to test intent. This means that for every action you request from a user (clicking a button, submitting a form, opening a link) a nonce comes in handy to check if they actually clicked that button or submitted that form. Obviously you do not have to add a nonce to each link in your theme; you only check intent when it is important that you check intent. For instance if you have a contact form in your theme; you'd only want to submit this when the user actually clicked submit. Here's an example:

```php
<form class="newsletter_form" method="post">
    <?php wp_nonce_field( 'mytheme_newsletter_form' );?> 
    <input type="email" name="email" placeholder="Please fill in your e-mailaddress">
    <input type="submit" class="button primary" value="Add me to the newsletter!">
</form>
``` 

---

## Validate and sanitize input
The main principle of the WordPress theme handbook's guide to security is to not trust your data. I can't agree more with that, so for every piece of data your theme processes, we'll be creating validators and cleaning up the input if needed.

To achieve this, we'll use as much of the default [WordPress sanitization functions](https://codex.wordpress.org/Validating_Sanitizing_and_Escaping_User_Data) as possible.

The way you validate and sanitize input is dependent on the type of API you're using. In most cases the [functions and examples](https://codex.wordpress.org/Validating_Sanitizing_and_Escaping_User_Data) on the Codex page are clear enough and you should use them whenever you're saving data to the database. 

### Sanitizing data from a theme options page
If you do settings-pages the WordPress way using [the Settings API](https://codex.wordpress.org/Settings_API) you'll get out-of-the box support for data sanitation by defining a `sanitize_callback` on each field, which is the third parameter in the `register_setting` function. Here's an example:

```php

register_setting(
    'mytheme_settings', //settings group
    'mytheme_subtitle', //add a 'subtitle' option
    'mytheme_sanitize_option_data' //default to a sanitize function
);

/**
 * Sanitize each setting field as needed
 *
 * @param array $input Contains all settings fields as array keys
 */
function mytheme_sanitize_option_data( $input ){

    $new_input = $input;

    //make sure a value is available, default to empty:
    if( !isset( $input['mytheme_subtitle' ] ) )
        $new_input['mytheme_subtitle'] = '';

    //run the input through sanitize_text_field()
    $new_input['mytheme_subtitle'] = sanitize_text_field( $new_input['mytheme_subtitle'] );

    return $new_input;
}
```
You might find this notation to be a bit cumbersome and say; "I can do all of this easier in regular 'ol php". Although I think you might be right about that, I also would say that the Settings API is maintained by WordPress and therefor assured of updates when a security problem arises, so I would urge you to keep using it.

### Sanitizing data from the Customizer
 The Customizer was build with data sanitation in mind and when you're declaring a new setting, it's actually just declaring `sanitize_callback` as a key-value pair. A lot easier that with the Settings API:

```php
$wp_customize->add_setting( 'mytheme_subtitle', array(
    'default'           => '',
    'transport'         => 'postMessage',
    'sanitize_callback' => 'sanitize_text_field',
) );
```
For an in-depth look [take a look at this article by Theme Shaper](https://themeshaper.com/2013/04/29/validation-sanitization-in-customizer/)

---

## Escape Output
Escaping output is just as important as sanitizing input. Even if you validate and sanitize, your mantra should remain; "Don't trust your data". This is because escaping is meant for other things. It's mainly used to prevent [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks and prevent your markup from not being invalid. Another factor at play is that you rarely add raw data to your themes. More often then not they pass through WordPress' filter system, which means data can change into anything before it gets echoed in your theme. For this reason it is considered good practice to escape as late as possible:

```php
<php $class = apply_filters( 'mytheme_custom_class', 'button primary' );?>
<a class="<?php echo esc_attr( $class );?>" href="<?php echo esc_url( home_url('/test') ?>">
    <?php echo esc_html( $buttonText );?>
</a>
```
In this example we use three default WordPress functions: <ins>esc\_attr</ins> for escaping an html attribute, <ins>esc\_url</ins> for specifically escaping a url and <ins>esc\_html</ins> to remove unwanted special html-characters.

[For an overview of every escaping function that WordPress offers out of the box, you can check the codex](https://developer.wordpress.org/themes/theme-security/data-sanitization-escaping/)

---

## Vulnerabilities in your Javascript
Javascript is taking up a more prominant role in WordPress development nowadays. An extensive and thriving ecosystems are some of the reasons for this. Unfortunately this also comes with a great weakness. Almost every thing in Javascript depends on NPM projects. For a theme that migh be 1.2 megabytes in size, it's not uncommon to pull in about 80 megabytes in javascript libraries. Even though most of these libraries are used in development by taskrunners, a lot of it will end up in your theme as well. And I'm going to go out on a limb and guess that you have no idea which libraries there are in your node\_modules folder, and what they all do. That's okay; neither do I.

Let's look at what we can do to reduce our vulnerabilities on the Javascript side:

### Don't upload node\_modules
This might seem like a no-brainer to many of you, but I've seen it happen way to often; fully functional and uploaded node\_modules folders in a theme. Apart from this being just a waste of server space, you're also throwing every javascript package you use online. This can be fine if you're familiar with [configuring NPM fully](https://docs.npmjs.com/misc/config) but most of us just use it to develop themes. If you're in need of javascript packages from your node\_modules folder; might I suggest concatenating that and loading that from a seperate directory.

### Use a service to check your packages
There are a few services out there that can compare the packages you use with a continuously updated black-list. This will help you sniff out any malicious packages that you, or your dependencies may depend on. 

A tool like [Snyk](https://snyk.io) has a free plan if you only occasionally need to test something (a 100 tests a month is pretty decent). If your theme is fully open source, however, using Snyk is completely free and limitless.

---

## Handling user data
I'm not going to tell you that you shouldn't use e-mailadresses for usernames (make usernames harder to guess) and I'm also not going to tell you that you should have very strong passwords (ideally in combination with a password manager), because they don't really concern building secure themes. That being said; you should do both of those things. 

The big thing in themes is how you handle author-pages and comments. If you do not need author pages, then please [consider removing them from your theme entirely](https://www.dreamhost.com/blog/why-anonymity-is-security-when-it-comes-to-wordpress/); anonimity is a way more secure alternative. If you do need author pages or comment-sections, please take the following checklist into account:

1. Do you need to display this user's emailaddress? In that case, please make sure his or her username isn't the emailaddress you've just published
2. Be carefull with fields like display_name; if you're dealing with an incomplete profile, this could also display user names.
3. Use the right user roles; an author doesn't have to be an administrator.

### Custom roles
If you're ever planning on creating something like an upload or sign-up form in your theme, make sure you tie it to a custom role in WordPress. This makes sure that those users are limited to just the capabilities you've set for them and excludes other plugins from monkeying with it. Besides; [adding a custom user role in WordPress couldn't be simpeler](https://managewp.com/blog/create-custom-user-roles-wordpress).

---

## Keeping themes updated
Any code you add on to WordPress needs to be updatable. Open source in general can only survive because of updates. If you've created an open source theme and submitted it to the WordPress theme repository, you can push new updates and people will get an update badge in WordPress automatically. But what if you're creating themes for clients? Would you really have to administer these updates by hand every day?

Of course not! There's plenty of solutions out there, but this has been my personal workflow for dealing with updates:

### Using child- and parent themes
First things first: we want our updates to reach as much clients as possible. So in most cases I use a child theme build upon a custom parent theme. All of the repeated functionality I need, I keep in the parent theme. The child theme then mainly exists just to provide the custom styling and html build-up for each client. Which, if you follow along with the rest of this blogpost is using mostly WordPress Core functionality. So updates to the child theme rarely have to happen.

### Using the github updater
My clients don't like their themes to be open source. And my parent theme usually isn't open source for that reason. In stead, I send my updates to a github repository and with a small tweak to my theme and the help of a plugin, it can receive those updates like regular WordPress themes would. 

The plugin in question is [the Github Updater by Andy Fragen](https://github.com/afragen/github-updater). It's really easy to setup: you just need to add this line of code to your theme's <ins>style.css</ins> file:

```css
GitHub Theme URI: lucprincen/carte-blanche
```

Using the plugin you can enter your Github or Bitbucket credentials and use those to even pull in private repositories.


### Periodically checking the health of your theme
If you have a propper WordPress host, your files are periodically scanned for malware and breaches. If you're on your own, you can use tools [like the Theme Authenticity Checker](https://wordpress.org/plugins/tac/).


## The final no-brainers checklist:
Hurray! You've reached the end and build your super secure and updatable WordPress theme. Now it's time for a final checklist of no-brainers, that still get forgotten way to much:

__1. Check file permissions__
After uploading; are there any files or folders in your theme accessible by anyone that shouldn't be?

__2. Did you blindly copy/paste code in your functions.php?__
Always check function.php snippets with third parties. Join the [WordPress community slack channel](https://make.wordpress.org/chat/) and verify there, or check on the [WordPress forums](https://wordpress.org/support/). There's loads of people willing to help!

__3. Did you store any credentials in git or svg?__
Any username + password combination has no place in your repository, even if the repository is private. Use `wp_config` or better yet; a tool like [Dotenv](https://github.com/vlucas/phpdotenv).

__4. Did you remove the option to edit files in WordPress?__
I know the irony of first telling you to not blindly copy/paste anything in your functions.php, but you should blindly copy/paste this line in your functions.php:
```php
define( 'DISALLOW_FILE_EDIT', true );
```
It disables file edits in the WordPress backend. It prevents both clients and criminals from altering php file which is (in both cases) a good thing ;-)

__5. Get great hosting__
All the security measures in the world won't matter on an insecure host. Managed WordPress hosts fill a real need for secure and fast WordPress hosting and there's a lot of great hosts out there. Just sayin'.