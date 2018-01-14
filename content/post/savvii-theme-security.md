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

- [Validating and sanitizing input](#validate-and-sanitize-input)
- [Escaping output](#escaping-output)
- [Vulnerabilities in your javascript](#vulnerabilities-in-your-javascript)
- [Handing user data](#handling-user-data)
- [Keeping themes updated](#keeping-themes-updated)
- [A final checklist of no-brainers](#a-final-no-brainer-checklist)

In each chapter we'll try to stick to as much default WordPress functions as possible. The reason for this is simple: if WordPress gets updated, these functions get updated. So if there's a new vulnerability discovered, and WordPress core has provided a patch, you can be sure your code is safe as well. It saves you time in updating and a lot of headaches.

Okay. Strap in, because we've got a lot of ground to cover!

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
Escaping output is just as important as sanitizing input. Even if you validate and sanitize, your mantra should remain; "Don't trust your data". This is because escaping is meant for other things. It's mainly used to prevent [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks and prevent your markup from not being invalid. 



## Vulnerabilities in your Javascript
(https://snyk.io/)

## Handling user data
  - don't show author usernames (https://www.dreamhost.com/blog/why-anonymity-is-security-when-it-comes-to-wordpress/)

## Keeping themes updated
    - Create a parent theme and use child themes
    - Use the github updater ( https://github.com/afragen/github-updater)
    - periodically check with https://wordpress.org/plugins/tac/


## The final no-brainers checklist:
    - check file permissions
    - don't blindly copy+paste code in your functions.php
    - don't store any credentials in git
    - remove the option to edit theme/plugin files: define( 'DISALLOW_FILE_EDIT', true );
    - get super-secure hosting.