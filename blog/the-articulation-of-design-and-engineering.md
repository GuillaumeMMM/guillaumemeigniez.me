---
title: The articulation of design and engineering
tags: blog
layout: layouts/post.njk
date: 2025-12-16 00:00:00
---

"Design Engineer" seems to be the most popular umbrella title right now for people working at the intersection of design and front-end development. However, it's hard to understand what it covers when reading job listings and blog posts. Everyone seems to define it by a different scope and a different skill list.

What is certain is that it's about bridging the gap between software development and design in the context of building digital products. Some talk about a [great divide](https://css-tricks.com/the-great-divide/) between the [front-end of the front-end](https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/) and the back-end of the back-end. Yet something feels wrong. If it were that simple, why can't we agree on a definition?

I worked for 4 years in a startup as a front-end engineer in charge of the front-end development and design, and then 2 years as a senior front-end engineer focused on accessibility and design systems. I can describe what articulating the design and engineering worlds together felt like, and what issues the role emerged from.

## Design tools abstract away the web platform

Web browsers are a complex stack of technologies and a confusing stack of specs. Product designers have a lot on their plate already, it's materially impossible for them to have a deep understanding of the platform. The web has strengths and limits that are not obvious from browsing the web and by using tools such as Figma.

It's obviously not a skill issue, in order to co-create a high-quality product everyone needs to limit their area of expertise.

If Figma was as precise as HTML, CSS and Javascript in describing interfaces for the web, the tool would be the web itself. And it is normal that the design tools constitute a level of abstraction. The gap between what's designed and what's then built by the developer is wide enough that a structural misunderstanding exists between engineers and designers.

Are good product designers expected to know the difference between `focus` and `focus-visible` on interactive elements? Yes they might, but should they know that most browsers do not differentiate the two on `input` HTML tags? Or that a `focus-within` that is also a `focus-visible` should not be used because the CSS property `:has` is only supported by 91% of the company's users? Probably not.

Yet the designs are (mostly) created in Figma and then handed to the developer who has limited time to produce the implementation.

## Front-end developers lack design context

The design being viewed as descending upon the front-end developer, the developer _must_ implement it. What _can_ be built takes precedence over what _should_ be built. The responsibility for design choices is eventually borne unilaterally by designers.

Should this icon color be added to the app even though it doesn't match any pre-existing color? That dialog has a title that does not match the common pattern, is that a new design directive or a mistake from the designer? The developer lacks knowledge of design decisions, the new design system foundations or a new accessibility pattern. And challenging the design might delay the feature by a whole cycle.

At some point, someone with the technical expertise and a product-level understanding of the existing patterns must voice an opinion on the design. Someone who knows how UIs are built across that product.

## The articulation

The argument here is that there is a gap in knowledge and understanding that cannot be filled without a new articulating role and vision. The tools and tech stack have become so complicated that no one covers both design and front-end development as 2 separate people would. It is not just "front-end of the front-end" that is needed here, because a global vision is required.

The role needed is of a front-end developer who has a good technical understanding of the product, who is able to collaborate with designers, to write documentation for different audiences and to navigate between teams.

The person in that role has two different approaches to the same problem. When the designers want a new pattern introduced, that person helps define it in a way that is compatible with the technical constraints. They can then implement those patterns and promote them to the engineering teams. They produce two different forms of documentation, because the reasons why a designer understands the importance of a guideline is not the same as for the developer.

Every company has a different approach based on their needs which can vary depending on the skills of their employees. There isn't one recipe, there isn't one divide. That's why [so many job titles exist](https://maggieappleton.com/design-engineers) : Design Engineer, UX Engineer, UI Engineer, Design System Developer, Front-End of the Front-End, etc.

My experience made me realize the need for a role with a wider perspective. Someone who works across teams and operates in both design and engineering.
