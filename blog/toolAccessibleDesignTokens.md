---
title: A Tool for Creating More Accessible Design Tokens
tags: blog
layout: layouts/post.njk
date: 2024-12-08 00:00:00
---

Building an internal design system at my company is an exciting position as it pushes me to dig into the frontend and design decisions history as much as it frees space to reorganise parts of the apps.

Both frontend engineers and product designers work to bridge the gap between today's users needs and yesterday's users needs, and the design system is a powerful lever for achieving this.

At my company, the design system started with a set of design tokens. Crafting a cohesive system of tokens is challenging since it must be understood by everyone as clearly and quickly as possible. And each set of tokens comes with its own challenges. For instance when choosing colours for a product, considering the contrast ratio in-between text colours and background colours is essential.

Yesterday's user and today's share the need for an accessible experience. Measuring accessibility is tricky, and companies are often more interested in measuring the conformity to a norm. A number of guidelines can be considered : (Globally <abbr title="Web content accessibility guidelines">WCAG</abbr> 2.2, and in my context the French guidelines RGAA ([Référentiel Général d'Amélioration de l'Accessibilité](https://accessibilite.numerique.gouv.fr/)) and the Luxembourgeois guidelines RAAM ([Référentiel d’Accessibilité des Applications Mobiles](https://accessibilite.public.lu/fr/raam1/referentiel-technique.html))). These guidelines can be cryptic and asserting the conformity of the hundreds of criteria takes forever.

As far as colour contrast is concerned, each have its own way of assessing the accessibility of text over a background. The ratio itself is (for now, and as far as I know) aligned with WCAG 2.2 AA criteria, but the definition of "large text" varies.

To overcome the complexity of assessing the conformity of a set of colour design tokens to various accessibility guidelines, I built a [design tokens contrast checker grid that is available here](https://www.contrastcheckergrid.com). [This type of tool already exists](https://contrast-grid.eightshapes.com/), but they are very often inaccessible themselves and don't offer options for alternative validation methods. Also I don't know if there is a colour contrast grid trend right now but [Dave Rupert just created a codepen contrast grid](https://codepen.io/davatron5000/pen/YzmwEZZ?editors=0010).

The options of the first version of my website are limited, but I plan on adding more tokens import options and more contrast checking mechanisms. A question has kept me up at night (at least one night, reading through github drama). WCAG 3 is being discussed, and I'd like to be up to date with the official contrast verification guidelines. Especially because it will likely include a new method of verification, and it will diverge from the French RGAA to which my company will still need to comply to.

In [the WCAG docs](https://www.w3.org/WAI/GL/WCAG3/2021/how-tos/visual-contrast-of-text/) another algorithm is mentioned : [APCA](https://github.com/Myndex/SAPC-APCA). It's a promising method that takes into consideration the non-linearity of human perception when looking at colours. However [some people raised concerns](https://github.com/w3c/silver/issues/574) regarding the method, and [other techniques might be under examination](https://github.com/w3c/wcag3/issues/10). Yet some people think that [APCA it is going to be the WCAG 3 choice](https://medium.com/@Marindessables/apca-r%C3%A9volution-dans-la-mesure-du-contraste-de-couleurs-pour-une-accessibilit%C3%A9-am%C3%A9lior%C3%A9e-c44e0b3f7c81) for sure. Although the last update [in Eric Eggert's blog post about WCAG 3](https://yatil.net/blog/wcag-3-is-not-ready-yet) states that according to the Accessibility Guidelines Working Group Co-Chair: "APCA is not in the current draft".

Adding that algorithm to the checker I built could be very useful, regardless of whether it's included in WCAG 3. But it seem impossible to officially implement an APCA tester [without stating what the author wants](https://git.apcacontrast.com/documentation/minimum_compliance.html). I'm not sure I understand the need for an integration compliance document for an algorithm that would be part of an official WCAG. To be continued..
