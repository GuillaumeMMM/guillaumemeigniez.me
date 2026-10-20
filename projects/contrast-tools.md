---
    title: A11y Contrast Tools
    description: A color contrast checker tool that's actually easy to use and another tool for finding text/background accessible combinations in a set of design tokens.
    date: 2025-01-01
    displayDate: 2026
    tags: projects
    layout: layouts/project.njk
    images:
      - src: ./images/color-contrast-1.png
        alt: A screenshot of the contrast checker UI
      - src: ./images/color-contrast-2.png
        alt: A screenshot of the color use example of the tool
      - src: ./images/grid-contrast-1.png
        alt: A screenshot of the contrast grid tool with a few color combinations shown. The invalid combinations are hidden
      - src: ./images/grid-contrast-2.png
        alt: A screenshot of the contrast grid tool with a few color combinations shown. The invalid combinations are shown as well
    links:
      - label: Contrast Checker
        url: https://a11ycontrast.eu/#ffdd33/#1f6689
      - label: Contrast Grid
        url: https://a11ycontrastgrid.guillaumemeigniez.me
---

This year I built a bunch of accessibility-related tools for design system developers and designers. Here are two websites I published to help assess the contrast of the colors we use.

## Contrast Checker

I'm always frustrated when I need to know the contrast level of a pair of colors. I have to open a tool or a website to manually type both colors and to decipher the UI to find which criterion applies.

I wanted a website that I can query to get that contrast ratio. And I needed to see the result of text over background combinations both ways. Most of all, I wanted to just have to type the color codes into the URL and nothing more.

Now when I type `https://a11ycontrast.eu/#1e2876/#29dbff` in the URL I immediately know that Midnight Blue and Deep Sky Blue have a sufficient contrast level for all criteria!

What always makes contrast compliance tools a little confusing is that there are different contrast thresholds for AA and AAA, but also that it depends on whether or not the text is "large scale".

[What is "large scale"](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html#dfn-large-scale)?

> with at least 18 point or 14 point bold or font size that would yield equivalent size for Chinese, Japanese and Korean (CJK) fonts

A "point" being 1/72 of an inch, because not everyone has a screen with the same [pixel density](https://en.wikipedia.org/wiki/Pixel_density). The standard on the web is to consider that the screen is 96 pixels per inch (PPI) but this is an approximation.

I also added the RGAA criteria (which are equivalent to WCAG AA) because the rule is phrased in px and not in points, but it does not make a significant difference.

## Contrast Grid

There is one thing we were always unsure of when building the tokens system at pass Culture. Among all color tokens, which combinations of text/background had a high enough contrast? Since the combinations change every time a single color is updated, it was a pain to always make sure that the combinations used in the apps were compliant.

Most importantly, we needed a way for every designer to understand which color combinations can be used. One can assume that it's completely fine to have `text-color-default` over `background-color-default`, but what about `text-color-success` over `background-color-subtle`?

I built this website to have a visual way to identify immediately all the color combinations that can be used given an accessibility conformance level. I added JPEG export so that the results can be easily shared as well.

One thing that seemed important was to have multiple ways of importing tokens. CSS variables seem like the default import to me, but I also included [DTCG](https://www.w3.org/community/design-tokens/) tokens JSON import. The format seems to be gaining traction even though it is not a widely adopted standard (it is often only partially supported).
