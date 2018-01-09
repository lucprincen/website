---
title: "Building secure WordPress themes"
date: 2018-01-04T17:11:29+01:00
draft: true
---

# Building secure WordPress themes


## Validate and sanitize input
    - customizer
    - options page
    - widgets
    - shortcodes

## Escape Output

## Keep an eye on your javascript
(https://snyk.io/)

## Consider handling user data
  - don't show author usernames (https://www.dreamhost.com/blog/why-anonymity-is-security-when-it-comes-to-wordpress/)

## Keep themes updatable

    - Create a parent theme and use child themes
    - Use the github updater ( https://github.com/afragen/github-updater)
    - periodically check with https://wordpress.org/plugins/tac/


## The final no-brainers checklist:
    - check file permissions
    - don't blindly copy+paste code in your functions.php
    - don't store any credentials in git
    - remove the option to edit theme/plugin files: define( 'DISALLOW_FILE_EDIT', true );
    - get super-secure hosting.