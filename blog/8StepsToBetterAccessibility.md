---
title: 8 steps to better accessibility
tags: blog
layout: layouts/post.njk
date: 2026-02-23 00:00:00
description: 8 easy questions to evaluate whether or not your company is doing enough with web accessibility
---

For 2 years, I was working at a French publicly funded company building software for tens of thousands of teachers and culture professionals, and for millions of French teenagers. As a front-end developer interested in the matter of web accessibility, I organised accessibility audits, then did follow-ups and corrections, I participated in accessibility planning and in choosing new tools, and I helped setup a new design system.

Inspired by [Joel on software](https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/), and reflecting on that intense experience, I built a set of 8 accessibility questions to ask in order to evaluate a company's capacity at developing accessible software. Those questions have simple yes or no answers, yet they're not always easy things to do. I believe that they encapsulate what I witnessed in the last few years.

Answering "yes" to less than 6/8 of those means your company might not release accessible software anytime soon.

## 1. Do you have an accessibility bugs database?

Is there a document where all known accessibility issues of the product are listed? Not everyone reads accessibility audit reports (if they exist), and not everyone tests the app on a regular basis. There needs to be a document for teams to know what fix could be integrated in their development process. A single source of truth that might just be a notion table or an excel spreadsheet that's kept up to date and that's easily consultable by product teams.

## 2. Do you fix known accessibility issues before building new features?

When a team is working on a new feature, do they fix the known accessibility issues related to that feature's scope first? If you answered "yes" to question 1, you do have a database of known issues. Is that source of information consulted before building a new feature? For example if the team was adding a section to a form on a page that's not responsive, would that page be made responsive at the same time? Another way to frame the question is: "Is there an effort to reduce the accessibility debt?".

## 3. Do you have a monitored accessibility feedback channel?

Ultimately you're doing accessibility for the users. When a user is unable to do an action, they will likely want to tell you about it. There needs to be an easy way to send a message from the app to the accessibility team (or to the team in charge of that part of the app). If you are using a third party assistant (such as a chatbot), you need to make sure that its UI is also fully accessible. You should at least have a dedicated email address to which people can report accessibility problems. Finding that communication channel should be possible in a reasonable number of clicks from anywhere in the app. And most importantly, there needs to be someone on the other end of that channel that reads the complaints.

## 4. Do you consider diverse experiences while testing?

The "R" in the accessibility [P.O.U.R. principles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG) stands for "Robust". It means that your product should account for a wide diversity of usages. It's impossible to predict what combination of hardware & software will be used to access your website. Therefore, you need to have as much diversity as possible as early as possible in the creation process. Do you test the software with disabled people? Do you test the website on different operating systems, on different browsers, with different devices? It's common for modern teams to be using only MacBooks with chromium based browsers, which is only the setup of [2% of screen reader users](https://webaim.org/projects/screenreadersurvey10/).

## 5. Can everyone in your product teams use basic assistive technologies and audit tools?

Can your designers, developers, QAs and product managers go through a page with a screen reader? Can they tell if a colour contrast is high enough? Can they read the automated tests results of tools such as [axe-core](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd), [headingsmap](https://chromewebstore.google.com/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi) or lighthouse? Can they open the dev console on their browser? Everyone who thinks about the user experience should at least be able to spot the critical issues that would block a user. Everyone has to learn how to test for accessibility at some point. That's why accessibility testing trainings are essential. And those trainings need to be adapted to different types of jobs.

## 6. Is there someone with a dedicated budget that is in charge of the accessibility strategy?

You need someone whose job it is to organise the accessibility strategy: plan the trainings, organise the documentation, manage the issues database, keep a roadmap up to date, talk to the leadership about accessibility status, organise user tests and audits. That person absolutely needs to have a seat at the table. If the accessibility evangelist of the company doesn't have a dedicated budget, managers will say that "yes accessibility is the priority of the company" and then allocate no money to it.

## 7. Do product teams have easy access to accessibility resources that they understand?

Accessibility documentation can be intimidating if not carefully crafted. A designer does not need the same documentation as a developer. Ideally there should be a variety of accessibility documentation so that everyone can find the information with the right level of context. There could also be an accessibility specialist available to answer accessibility questions as new features are being built.

## 8. Do the teams use accessible building blocks?

Is there a design system (internal or external)? It's necessary (yet not sufficient) that the building blocks of an app are accessible by design. And has that system been audited for accessibility? If there's a UI kit, do the components of that kit have accessibility unit tests? And does the ci include automated visual testing for basic blocks? Is that new select with autocomplete library that was recently installed compliant with WCAG? (probably not)
