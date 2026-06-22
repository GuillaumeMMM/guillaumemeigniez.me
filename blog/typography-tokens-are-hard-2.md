---
title: Typo tokens are hard to get right (Part 2)
tags: blog
date: 2026-06-22 00:00:00
description: Have you ever tried updating your typography tokens? Chances are that for some of them you can't change their values that easily. This blog post describes strategies chosen by popular design systems to face this issue.
layout: layouts/post.njk
---

In [part 1](https://guillaumemeigniez.me/blog/typography-tokens-are-hard-1/) we saw that most design systems don't consider how fonts work on the web when building their tokens system. Not thinking about the CSS `@font-face` rule leads to solely performative font-weight, font-family and font-style primitive tokens that cannot be automatically updated.

Now let's see what solutions existing design systems have opted for.

## Static typography

Most design systems are created with one or two specific font families in mind. The fonts are core to the design of the system and are not supposed to ever be modified. It makes sense to do so: different fonts have different ways of filling the space on the page, and you need to build your colours, your animations and your spacings accordingly. A good example for that is [IBM Carbon](https://carbondesignsystem.com/) that uses their own historical typography tied to IBM's global design vision:

<div class="mdf-quote">
  <blockquote cite="https://carbondesignsystem.com/elements/typography/overview/">
  Our approach to the typographic system uses IBM Plex as its typeface. It has been carefully engineered with suitable scales, styles, and weights to help create clear hierarchies and organize information that guides users through IBM products or experiences.
  </blockquote>
</div>

When you use Carbon Design, you need to download their npm packages. In the [README.md](https://github.com/carbon-design-system/carbon/blob/c393ca1d1f7ea110bae44b2ca0ea5bd3ba4ac8c1/packages/styles/scss/fonts/README.md) of `@carbon/styles` it's explained how you'll have to manually include the fonts you want to use in the code. Their tooling does the rest. But in the end, the family, width and style of fonts are not design tokens.

Other design systems have a frozen font-family but also expose typography tokens as if you could update them as easily as you change the shade of `red-500`. An example of that would be [Skyscanner's Backpack](https://www.skyscanner.design/latest/welcome-to-backpack-Mtf5OEo4) design system with "Skyscanner Relative" and "Larken" custom fonts, [typography tokens](https://github.com/Skyscanner/backpack-foundations/blob/67a322c376e6855122e8e5bf2a2b69b2b34887fe/packages/bpk-foundations-web/tokens/base.scss#L799) passed as-is to SCSS mixins and no `@font-faces` indications. These tokens are purely performative, and design system authors might not be aware of the extra step required to update their value.

## System fonts

Several battle-tested design systems have opted for system fonts. Similarly to the static typographies above, they set a specific list of system fonts as the `font-family`. Examples of these can be found in [Salesforce Lightning 2](https://github.com/salesforce-ux/design-system/blob/ace6c9cfcf03e6eedf030468ee10b2e68f555c51/design-tokens/aliases/font-family.yml), [Palantir's Blueprint](https://github.com/palantir/blueprint/blob/develop/packages/core/src/design-tokens/tokens/base/typography.tokens.json) or [GitHub's Primer](https://primer.style/product/primitives/typography/).

The advantage of this strategy is that the "system fonts" are expected to already be present on the vast majority of users' devices. Also, even if one of the system fonts is not available, or when setting various font-weight and font-style, the result has good chances to look like what you'd expect.

But your texts would look generic, and if you are trying to build a brand with a little more character the texts might look a little plain.

Most importantly the final look of your typography would not be set in stone. You can't predict what's available on the user's device, and might have to design your apps with multiple possible fonts in mind. If the user has one of the system fonts available, it will be used even if the font-style or font-weight do not exist for that specific font on the user's device. According to the [W3C documentation](https://www.w3.org/TR/css-fonts-4/#font-synthesis-intro), the user agent (browser) might (or not) adapt the characters to look like what it predicts you want:

<div class="mdf-quote">
  <blockquote cite="https://www.w3.org/TR/css-fonts-4/#font-synthesis-intro">
  For example, a user agent might:
  <ul class="mdf-list">
    <li>synthesize a bold face by drawing a thin stroke around each glyph</li>
    <li>[...]</li>
    <li>synthesize an oblique face by geometrical shearing of each glyph</li>
  </ul>
  </blockquote>
</div>

These synthetic fonts are the infamous _faux-bold_ and _faux-italic_, and every browser is free to make them look however they want.

With system fonts you should be ready for the text to look very different between users.

## Generated @font-face

If the design system has a token for the font-family (i.e. you're supposed to be able to change the family), we saw that you have to update the `@font-face` every time it changes to adapt which font file each text setting points to. This can technically be done automatically by generating the CSS `@font-face` every time the project is built.

In [part 1](https://guillaumemeigniez.me/blog/typography-tokens-are-hard-1/) we had this example:

```css
@font-face {
  font-family: Proxima Nova;
  font-weight: 400;
  font-style: italic;
  src: url(/static-assets/font/ProximaNova-RegIt-webfont.woff2) format("woff2");
}
```

So we'd want the font face rule depend on the tokens like this:

```css
@font-face {
  font-family: var(--body-italic-font-family);
  font-weight: var(--body-italic-font-weight);
  font-style: var(--body-italic-font-style);
  src: url(var(--body-italic-font-src)) format(var(--body-italic-font-format));
}
```

With two new tokens: one for the URL at which the new font file can be found, and a format token for the type of font file.

There are still two issues:

- CSS variables are not supported inside `@font-face` rules, so there needs to be a CSS pre-processor such as Sass or a specific build step that does it.
- Having the URL as a tokens means that you have to know that the file exists at a specific location (and will stay there). And if that location is your server, you'll still need to upload the new font file to it.

IBM Carbon [does a version](https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/fonts/_sans.scss) of this, but their use case is a little different, because they already have a restricted set of fonts, they can pick the right one and set its (local) location inside an auto-generated font-face on build.

Another example of that is the US Web Design System that [generates](https://github.com/uswds/uswds/blob/12b176dd9585a467b683ddd0241940838cc03c3c/packages/uswds-core/src/styles/mixins/general/font-face.scss#L9) `@font-face` on build based on a set of design tokens. However, just like IBM Carbon, USWDS specifies [a set of font families](https://designsystem.digital.gov/components/typography/) that are shipped with the design system itself.

For both of these design systems you could still set an URL for your custom fonts requirements.

On a side note, using font sources from Google Fonts is convenient, but is not a good idea, especially in the EU. You would condemn all your users to ping a Google server every time they open a web page using your design tokens, which (most probably) helps tracking their behaviour. In 2022 [a Court in Munich](https://www.gesetze-bayern.de/Content/Document/Y-300-Z-BECKRS-B-2022-N-612) ruled the practice of sharing a user's IP with a US server through the download of a Google font unlawful.

## Variable fonts

Last but not least, [variable fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Fonts/Variable_fonts) can be a piece of the solution. If your priority is to be able to update `font-weight` and `font-style` whenever you want, they might be your best shot.

With variable fonts, you only have one or two font files. That single file can produce a set of glyphs for any variation of font weight and style. Which means you only have one `@font-face` rule that sets the link between the font name and its file:

```css
@font-face {
  font-family: "MyVariableFontName";
  src: url("path/to/font/file/my-variable-font.woff2")
    format("woff2-variations");
}
```

Now whatever the value of your `--body-italic-font-weight` and `--body-italic-font-style` are, there is a predictable glyph displayed on screen. That's very convenient. And until recently Figma made it hard to work with variable fonts, but since recently you can have a variable font weight that is a number value bound to a Figma Variable. Which makes the token integration seamless.

It however does not solve the issue of updating the font-family. Also using variable fonts or not is still up for debate since they might raise concerns regarding the file sizes or their support. If you need to support older versions of browser (or if you're working with platforms other than the web) that would not support variable fonts, you might need to have fallback fonts that would be static anyways.

Examples of design systems using variable fonts with a token for font-weight are [Atlassian ADS](https://www.figma.com/design/p25sVQhNFwWsea9SIJDmej/ADS-Foundations--Community-?node-id=26062-88725&t=PppzJCVxh4RLTk29-4) or [Shopify's Polaris React](https://polaris-react.shopify.com/tokens/font).

We can see from these different strategies that there is no magic trick making typography tokens easy. You'll have to make compromise on your design system tokens exhaustivity (hey it's not a bad thing to be opinionated!). Technical solutions can exist, but are so much more expensive than their benefit in flexibility that no one has built them yet.

Stay tuned for the bonus part of this tokens series. I'll discuss some unexpected things and rabbit holes I ended up researching along the writing of these posts.
