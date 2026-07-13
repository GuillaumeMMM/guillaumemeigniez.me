---
title: Typography tokens - Bonus
tags: blog
date: 2026-07-13 00:00:00
description: A few notes on what I reasearched and notices while writing the first two blog posts about typography design tokens.
layout: layouts/post.njk
---

I recently published a [2](https://guillaumemeigniez.me/blog/typography-tokens-are-hard-1/) [parts](https://guillaumemeigniez.me/blog/typography-tokens-are-hard-2/) blog post regarding the challenges inherent to building typography design tokens. During the research that led to these posts I wrote down surprising things and went down a few rabbit holes. Those did not make it into the original posts, so I'll talk about theme here.

## Google Fonts

Google's advices regarding Google Fonts is that you should use their CDN and that [they will not](https://fonts.google.com/faq?hl=en#privacy) "use any information collected by Google Fonts to create profiles of end users or for targeted advertising".
I have to say that, before looking into it, I thought that downloading the font via `fonts.gstatic.com` was lazy but fine. Now I believe that you should never impose that on your users for privacy reasons.

Google saying that the user information (IP, referrer, user agent) is not collected by Google Font does not mean that they don't collect it at all. It's unclear which services are used by Google to track users online, but it's pretty obvious that with the [third party cookies restrictions](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Third-party_cookies), big actors look at other ways to track users such as fingerprinting.

For now the IP address is considered personal data as defined by GDPR, and downloading third party content on a website shares that data. As far as the fonts are concerned, it is always done without the user's consent (it wouldn't make sense to wait for a consent before displaying the expected font), and therefore is illegal. The [Munich court ruling](https://www.gesetze-bayern.de/Content/Document/Y-300-Z-BECKRS-B-2022-N-612) from 2022 is very interesting but does not seem to have set a precedent that would impact how websites download fonts.

Additionally (if I understand the situation correctly) the [2023 EU–US Data Privacy Framework](https://en.wikipedia.org/wiki/EU%E2%80%93US_Data_Privacy_Framework) seems to have created the confusion about whether or not that ruling would be the same today.
Anyway, preventing websites from downloading fonts from third parties would be a problem for Data Protection Authorities who lack funding to enforce the law when it comes to consent on the internet.

That may be one of the reasons why the European Commission with the [EU Digital Omnibus proposal](https://digital-strategy.ec.europa.eu/en/library/digital-omnibus-regulation-proposal?ref=element.io) is in the process of changing the meaning of "personal data" to [define it as something](https://www.pinsentmasons.com/out-law/news/eu-digital-simplification-to-soften-data-ai-rules) "reasonably likely to be used to identify the natural person to whom the information relates". Who knows what "reasonably" means.
Two fun facts to conclude this section:

- IBM Carbon was actually [making you download Google Fonts](https://v10.carbondesignsystem.com/guidelines/typography/code/) with Google CDN until version 10. Version 11 came out four years ago but some websites such as [IBM's global login page](https://login.ibm.com/authsvc/mtfim/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:basicldapuser) still download IBM Plex from `fonts.gstatic.com`.
- Even if you are careful to self-host fonts on your domain, some bot challenge pages download fonts from `fonts.gstatic.com` (for the 5 elements they need to display), which would leak your users personal data.

## Figma & DTCG

I work on web apps and websites so I'm always surprised when Figma does something that doesn't exactly match what browser specs say. (I also worked on a fairly large design system for web & mobile, but the mobile part was React Native, thus the use of typography design tokens was pretty much equivalent to a web css-in-js setup.)

For example, I notice the gap when designers say "hug" and "fill" instead of "fit-content" and "max-content", "frame" for "div" or "constraints" for "position". Figma invents a new set of terminologies to match the already established ideas of what a "frame" or a "constraint" are in different platforms. This leads to passionate discussion when naming things for a design system.

At the same time, Figma does look a lot like it's made to match the properties of CSS. It feels like Figma is stuck in between being universal enough to match any prototyping practice, and being specific enough so that the web-focused users (probably most of them) have a seamless experience.

In that sense the [Design Tokens Community Group](https://www.w3.org/community/design-tokens/) faces the same dichotomy when building specs for design tokens which have to be both ubiquitous and compatible with unique web specificities.

For example [one of the latest issues](https://github.com/design-tokens/community-group/issues/390) opened on their GitHub repository is asking why there's no support for `em` as a dimension token unit, while `px` and `rem` already exist. It's a valid question for someone trying to fit the DTCG specs with their web project. But also isn't it weird that the DTCG spec has a unit called "rem", which is a web convention, may not make sense on other platforms?

I did not include anything about DTCG in my first two blog posts because its specs are not widely integrated across the design system tech tools yet. Maybe due to the dichotomy mentioned above.
On a side note, DTCG does not indicate any way of building typography design tokens that take into account the `@font-face` rule pitfalls.

## Font weight tokens

When researching the topic of web typography from the designer's point of view I noticed that there's a very common misunderstanding of the weight of fonts. Most designer oriented tutorials and content I came across confuse the weight scale of a font with the arbitrary static naming it was given by the font creators.

It becomes a problem when using a token for font weight thinking that it would work across font families. As if the glyphs in "Montserrat-Medium.ttf" would have the same thickness as "... Md.ttf". As if the "Medium", "Rg", "black" or "MdDark" that appear in font file names were a norm that matches a predictable thickness.

One of the points of my previous blog posts was to explain how those are completely arbitrary and how the `@font-face` rule must be the link between the numerical weight scale (from 100 to 1000) and the font file.

Many tutorials on how to build design tokens for typographies in Figma tell you to create primitive weight tokens such as "Medium", "Regular" etc. In which case the naming has to match the exact weight naming of the font file in Figma. Doing so would obviously break as soon as you change font families.

I believe that it's always a bad idea to name weight tokens that way. It only makes the designer's job easier when creating the token system. It seems to be much more robust to use the numerical scale.
