---
    title: tsembroidery
    description: A library for transforming vector images into embroidery designs for sewing machines.
    date: 2026-03-01
    displayDate: 2026
    tags: projects
    layout: layouts/project.njk
    images:
      - src: ./images/tsembroidery-1.png
        alt: A screenshot of a thread being edited in bayeux.app in dark mode
      - src: ./images/tsembroidery-2.png
        alt: A screenshot of the landing page of bayeux.app
      - src: ./images/tsembroidery-4.png
        alt: A screenshot of a thread being edited in bayeux.app in light mode
      - src: ./images/tsembroidery-3.png
        alt: A screenshot of the color reduction tool of bayeux.app
    links:
      - label: tsembroidery package
        url: https://www.npmjs.com/package/@guillaumemmm/tsembroidery
      - label: Bayeux.app
        url: https://bayeux.app/
    technologies:
        - TypeScript
        - React
        - NextJS
---

<div class="mdf-block mdf-block-warning" style="margin: 1rem 0">
    <span class="mdf-emphasis">Gen AI Disclaimer:</span><br>
    <ul class="mdf-list">
        <li>The porting of the existing API from pyembroidery to tsembroidery was done and checked byte for byte with the help of Claude Code.</li>
        <li>The development of the Bayeux web app was almost entirely executed with the help of Claude Code.</li>
    </ul>
</div>

I own a sewing machine that has an embroidery mode. That means if I buy an embroidery design online, I'm able to put it on a USB key, plug it into my machine and it will embroider it automatically. It's kind of magic. That was wonderful until I wanted to embroider my own designs. For that purpose Brother (the sewing machine company) also sells software (PE Design Plus) that lets you create shapes and text and export them as an embroidery design. The software is not great but it works. However, it has a huge problem: it only works on Windows and ever since I started using a Mac I couldn't create designs to embroider anymore.

A few years ago I started the project of creating a web tool that converts .svg images into .pes (Brother's embroidery format), with the help of the `pyembroidery` library. `pyembroidery` is a Python package that lets you convert one embroidery format to another, and introduces an intermediary embroidery structure `EmPattern`. Based on that, I coded my own `svg -> EmPattern` function in Python, set up a Python server and built an online conversion tool called "Broiderer".

It was a huge pain. The Python library had more than 1GB of dependencies and was quite slow. But at that time I wrapped my head around how to transform an SVG file into an embroidery file. In short: how to transform vector shapes into a thread path that fills those shapes.

This year, I had a little bit of time, and I wanted to practice coding with Gen AI. Based on what I knew I needed, I prompted my way into a byte-identical port of `pyembroidery` into TypeScript. I added an API and an `svg -> EmPattern` pipeline heavily inspired by what I created for Broiderer. I called it `tsembroidery` (how original), and published it.

I then built another file converter that used `tsembroidery` called "Bayeux Converter". Having a TS dependency made things much simpler. The converter is not online anymore, as it was replaced by a more ambitious app.

I had an idea for an app that would not only let you transform `svg` into `pes` (and other embroidery formats), but a tool where you could precisely change the embroidery so that you can have full control over what your machine does. How long is that thread, when to change colors, how many times will the needle pierce at that exact position, etc.

That's how I ended up with Bayeux.app. It's fully free and local, no login needed.

And it's still a work in progress!
