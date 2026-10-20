---
    title: Marque de Fabrique
    description: A personal set of styles that I can use as boilerplate for any new project.
    date: 2023-01-01
    displayDate: 2023
    tags: projects
    layout: layouts/project.njk
    images:
      - src: ./images/mdf-1.png
        alt: The color palette of the library
      - src: ./images/mdf-2.png
        alt: Examples of code, quotes and keyboard elements from the library
      - src: ./images/mdf-3.png
        alt: Example of UI elements from the library
      - src: ./images/mdf-4.png
        alt: The different buttons from the library
    links:
      - label: GitHub
        url: https://github.com/GuillaumeMMM/marquedefabrique
      - label: Demo
        url: https://marquedefabrique.guillaumemeigniez.me/
    technologies:
        - CSS
---

Since 2023 I've been building a lot of small websites and web apps. When the project is straightforward enough, I go for the simplest structure: `vite`, Vanilla JS, sometimes TypeScript, a few CSS styles and I'm good to go. Yet even though it's a light setup, styling always starts with a bunch of boilerplate: a `reset.css`, a set of CSS variables to get a reliable light/dark theme support, and (what arguably takes the most time) a set of styles for UI elements (buttons, links, inputs, etc.).

I'm not a big fan of installing a quadrillion dependencies when I'm only shipping 2K lines of code, so I avoid installing UI packages in that case.

I wanted to have this styling boilerplate ready, and I wanted consistency in how my websites look. That's what marquedefabrique is for. It's a set of CSS stylesheets that can be imported in CSS or in JS in any of my projects. It has no dependencies and it only includes a handful of lines of CSS.

The library has been evolving over the years, incorporating new UI elements styles and adapting to my preferences.
