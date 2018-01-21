---
Categories: ["Development","WordPress"]
date: "2017-07-22T17:51:59+02:00"
title: "Building a WordPress deployment tool"
---

The last couple of weeks I've been working on a deployment tool for a client. It's quite a doozy and -as far as I know- there isn't anything out there like this (and I looked!). I wanted to talk about what it is, how it works and what I ran into.

<br/>
## A brief history of WordPress deployment
There are lots of ways to deploy a WordPress website. The most popular of which is (sadly) still FTP, as far as I can tell. Rolling out updates with Git or SVN is second and way down on that list are automated tools like [WP Deploy](https://github.com/Mixd/wp-deploy) and [Bedrock](https://roots.io/bedrock/) which use Capistrano. I've been working with GIT and Capistrano deployment for quite some time now, but they weren't sufficient for my clients wishes. And that all had to do with WordPress multisite.

<br/>
## The Project
We created a multisite installation where the main site could broadcast content down to it's sub sites. These subsites are being sold to the clients of our client at a very competitive price, along with the added benefit of free content pushed from the main site that's being maintained by the branch organization they are buying the site from. 

The sub sites all have their own unique child-theme and they all work with our [Sections](http://get-cuisine.cooking/?page_id=115) tool, to which we've added pre-generated sections for things like Call to Actions, Hero's and news collections. This enables rapid page and layout creation. All of these sections have up to 5 different possible styles, so when combining different styles each time, each sub-site, while fully generated with existing code, truly maintains a unique feeling.

<br/>
## The challenge
On the multisite level this all looks and works great, but the deal was that we were going to be adding lots of subsites over the coming years. We didn't want to end up in a situation where we were constantly porting over the entire multisite installation everytime a client-site needed to be developed. So we chose for a different strategy: 

> Create a single WordPress install with the same setup and push it into a multisite environment when moving it to staging or production

That way development could remain very agile while the production environment was unharmed. So we needed a way to push and pull a single WordPress install into WordPress Multisite and we needed to do this fully automated because of small financial margins on sales of the subsites.

<br/>
## Basic technical layout
Thinking about how we needed to tackle this I started fooling around with [WP Migrate DB Pro](https://deliciousbrains.com/wp-migrate-db-pro/) which is a fantastic plugin for migrating databases and media-files across multiple environments. Using a helper plugin they offer multisite support as well and can also push pr pull from a multisite install into a single site. But since we wanted this control to rest on the local (single) install, we needed to build it ourselves. 

Mapping out the filter and action hooks WP Migrate DB Pro offered, though I came to the conclusion that I could still use the basic migration logic, I only needed to step in and change a few variables here and there:

1. fetching the blog Id of the site we're deploying (if it doesn't exist; create it)
2. changing the database prefix on the local level
3. changing the database prefix on the remote
4. porting over local users
5. sending all media files through WP Migrate DB Pro, to the right destination folder

That meant that we had a sure-fire way of migration all content and media files across servers. With that logic done, all we had to do was create an extra rsync-command that would push or pull the subsite's child-theme.

<br/>
## Multisite is weird
So multisite was the biggest producer of problems in the project and that's because Multisite is whack, yo. The way multisite was added into core seven years ago it was merged with backwards compatibility in mind. Although this is a noble undertaking, it has lead to some pretty hefty choices in how multisites handles data. The biggest issue I ran into was concerning user roles. Instead of grabbing the regular `wp_user_roles` site option, multisite needs to grab the exact same option, but from a key that is prepended by the sites database prefix (so `wp_user_roles` would become `wp_5_user_roles`, if the blog ID of that subsite was 5). Together with Migrate DB Pro this produced some issues.

Another issue we ran into is that multisite uses a per-page setting called `allowed_themes` which of course doesn't exist in a single install, so we needed to create this setting every time we finished off a deployment.

<br/>
## More Problems
The other problems we ran into were more logistic in nature. Media files, for instance, on a multisite installation tend to not get saved in /wp-content/uploads/2017, but in /wp-content/uploads/sites/5/2017 (if the blog ID of that subsite was 5). We needed to feed this prefix to WP Migrate DB Pro when pushing the images, and we needed to remove it when pulling the media. For the first action there was a filter available. For the second; not so much. So we temporarily forked the `wp migrate db pro media files` plugin and have opened a ticket with Delicious Brains requesting this specific filter.

Another big problem was handling all these different dependencies. Apart from our own plugins and tools, we needed WP Migrate DB Pro (obviously) and some related plugins, Gravity Forms for form handling and some other general WordPress plugins ([Yoast SEO](https://yoast.com/wordpress/plugins/seo/) and [Post duplicator](https://nl.wordpress.org/plugins/post-duplicator/), amongst others). We handle all dependencies with the best dependency manager PHP has to offer: [Composer](https://getcomposer.org). 

Standard WordPress plugins that are available via wordpress.org already have a fantastic Composer repository in the form of [WPackagist](https://wpackagist.org/), so that takes care of most of the 3rd party plugins.

WP Migrate DB Pro offers a fantastic solution for composer out-of-the-box. They provide their own repository to which you can post your license-key. With that added, you can safely download the latest version:

{{< highlight js >}}
"wp-migrate-db-pro": {
    "type": "package",
    "package": {
        "name": "deliciousbrains/wp-migrate-db-pro",
        "type": "wordpress-plugin",
        "version": "1.7.2",
        "dist": {
            "type": "zip",
            "url": "https://deliciousbrains.com/dl/wp-migrate-db-pro-latest.zip?licence_key={{LICENSE}}&site_url={{URL}}"
        },
        "require": {
            "composer/installers": "^1.0"
        }
    }
},
{{< /highlight >}}

<br>


Gravity Forms was a bit trickier as they generally only provide a .zip file for paying members. However; there are Github repo's available which can provide the plugin for our Composer setup, even if the plugin itself doesn't have a composer.json

{{< highlight js >}}
"gravity-forms": {
    "type": "package",
    "package": {
        "name": "gravityforms/gravityforms",
        "version": "master",
        "type": "wordpress-plugin",
        "source": {
            "url": "git@github.com:wp-premium/gravityforms.git",
            "type": "git",
            "reference":"master"
        }
    }
},
{{< /highlight >}}
<br/>

The eventual composer file now loads in dependencies from 5 different locations and composer-repositories. WP CLI handles all plugin activations automatically, and sets our license keys for WP Migrate DB Pro and Gravity Forms. 

The parent theme is just a git-repo with a valid composer.json file, and each child theme is cloned by the bash-script and renamed after the client name. 

<br/>
## Conclusion

I loved working on this tool. It's more of a site-generating application then a regular WordPress site. And even though it's closed source and the application will remain property of my client, I'd love to see what else can be done with these techniques. If you have any ideas or are interested in a little demo, don't hesitate to [contact and/or hire me](/hire-me).