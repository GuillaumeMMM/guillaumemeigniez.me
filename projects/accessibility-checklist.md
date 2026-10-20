---
    title: Accessibility Checklist
    description: A practical guide for product teams to check the RGAA accessibility compliance of new features.
    date: 2026-01-01
    displayDate: 2026
    tags: projects
    layout: layouts/project.njk
    images:
      - src: ./images/a11y-checklist-1.png
        alt: A screenshot of the accessibility checklist website
      - src: ./images/a11y-checklist-2.png
        alt: A screenshot of the accessibility checklist website with a detail on one of the rules
    links:
      - label: Website
        url: https://a11ychecklist.guillaumemeigniez.me/
---

When I worked for [pass Culture](https://pass.culture.fr/), the feature teams were (mostly) responsible for testing the accessibility of their releases. To compensate for the lack of team members with manual accessibility testing knowledge, I built a checklist so that anyone with minimal web literacy could identify most of the recurring accessibility issues.

What differentiates this checklist from the ones available on the web (of variable quality) is that it was specifically made for its audience. Most checklists on the web are WCAG focused, and are of two types: either they go through all the criteria and for each one of them re-phrasing the content of the "How to meet" section, or they just give some very basic advice.

People at pass Culture knew these resources existed and still did not use them. [What I think matters](https://guillaumemeigniez.me/blog/8StepsToBetterAccessibility/) is that people have access to accessibility documentation they can understand.

I identified the most common a11y compliance errors from previous audits. The manual testing of releases in teams without any accessibility specialists is bound to fail if they need to re-check the whole list of criteria for every delivery cycle. The team's effort should eliminate at least 80% of nonconformities (that are not yet caught by automated tools) without spending a whole day on it.

I put emphasis on the reason the rule exists. Most of the time, people have no idea why the website's heading hierarchy must be coherent, or why links must be explicit about their way of opening. Explaining the reasons for a rule makes the testers care more about the inclusivity of the UI.

Since we were working for a French government entity, we were required to comply with RGAA (a derivative of the European standard EN 301 549 that is itself basically WCAG 2.1). The RGAA often has a slightly different take on a11y testing, compared with what W3C guidelines say. Which makes the existence of the RGAA-focused checklist even more relevant.

The checklist is in French. It does not make sense to translate it into English since no-one in the anglophone world refers to RGAA.
