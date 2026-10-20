---
    title: pass Culture Design System
    description: While working at pass Culture, I built the technical side of the new design system.
    date: 2025-10-01
    displayDate: 2024 - 2025
    tags: projects
    layout: layouts/project.njk
    images:
      - src: ./images/pass-culture-ds-2.png
        alt: A screenshot of a radio group from the pass Culture design system
      - src: ./images/pass-culture-ds-1.png
        alt: A screenshot of a text input from the pass Culture design system
      - src: ./images/pass-culture-ds-3.png
        alt: A screenshot of a checked checkbox from the pass Culture design system
      - src: ./images/pass-culture-ds-4.png
        alt: Diagram of the layered architecture of design tokens for the pass Culture design system
    links:
      - label: pass Culture
        url: https://pass.culture.fr/
      - label: Design System Package
        url: https://github.com/pass-culture/design-system
      - label: Storybook
        url: https://pass-culture.github.io/pass-culture-main/?path=/docs/design-system-textinput--documentation
    technologies:
        - React
        - React Native
        - Style Dictionary
        - Storybook
        - Zeroheight
        - Figma Variables
---

From 2023 to 2025 I worked at pass Culture in Paris, and for almost two years I was part of a very interesting project. I was paired with a Design Lead to build the new Design System for the main mobile and web apps of the company. I was in charge of the technical side of that project.

After defining together what that design system should be about, I set up a design tokens pipeline as a standalone library. It took JSON format tokens (that can be exported from Zeroheight or Figma Variables), and generated variables files that could be included in the consuming apps builds. I made it work with the style-dictionary library. In the end the three-tier tokens system supports multiple themes (light/dark and others if needed), multiple brands (the customer-facing app and the front office), and multiple platforms (React & React Native).

I co-designed and developed React components for the library, and with the Design Lead I was paired with, we set up a governance process so that product feature teams can include the development of the components in their own sprints.

With it we fulfilled three goals:

- we successfully homogenized the styles of the pass Culture apps: we went from hardcoded colors everywhere to a centralized working dark/light theme and from a free-for-all components re-creation to a set of well suited unique components
- we centralized the documentation of the UI: a single place where anyone can come and see how the components work, and what decisions led to the design tokens the way they are
- we ensured accessibility compliance from the lowest level of the UI with WCAG compliant color contrasts, unit-tested atomic components and thought through WAI-ARIA patterns
