---
title: Frontend virtualization, performances vs accessibility
tags: blog
date: 2025-12-28 00:00:00
layout: layouts/post.njk
---

I recently subscribed to [Frontend Masters](https://frontendmasters.com/) and started watching some of their online courses. I've been following the "expert" path and am pretty happy with the quality of the content for now. However, one of the courses I initially subscribed to left me puzzled.

The course is called ["Frontend System Design"](https://frontendmasters.com/courses/frontend-system-design/). It was released in 2024 and focuses on Observer APIs, networking, optimization, and virtualization. It ends with a mock system design interview that is especially interesting in how it dissects a part of the frontend hiring process that is rarely documented. During that interview exercise, the teacher reuses what's been learned during the course and designs an infinite scrolling card feed with virtualization.

During the final Q&A session, he mentions how that method of virtualization is inaccessible, and briefly explains why. It annoyed me a little that the one course I was looking forward to as the pinnacle of frontend systems knowledge would knowingly ignore the accessibility of the solution. It's just a mock interview and it does not represent the state of the industry, but it made me want to dive deeper into virtualization.

## Inaccessibility of virtualization

Virtualization is an optimization technique for the rendering of very long lists of elements. To minimize the number of elements rendered, a virtualized list only displays what's visible inside the user's viewport. When the user scrolls down, items from the top of the list are reused to make new items appear below. The list is positioned in a new layer and CSS transforms are used to reduce the number of re-paint of the absolutely positioned elements.

The problematic word above is "visible". If only what's visible by scrolling is rendered, it means that you have no information and no interaction is possible with other items in the list.

- Using a keyboard, elements other than the ones in the viewport are not reachable.
- When navigating via headings or links, only a subset of the actual content is available.
- Using screen readers, the count of items or the current position are wrong.

These are the first few things that I can think of, and I don't see obvious adjustments to fix them. There is a fundamental misunderstanding. Virtualization is an optimization of what we see on the screen, as if any other element of the render tree were a useless overload consuming power. I have learned that considering accessibility when building an interface often translates to asking myself "does this still work without a screen and a mouse?".

## State of the art

The most popular libraries [react-window](https://github.com/bvaughn/react-window) and [react-virtualized](https://github.com/bvaughn/react-virtualized) were created to implement this pattern. I'm pretty sure they solve the problem incredibly well for many users.

Looking at accessibility issues on react-window's GitHub, there's an issue from [last September](https://github.com/bvaughn/react-window/issues/834) that was opened because `<li>` tags were not direct children of `<ul>` tags. [Another one from 2023](https://github.com/bvaughn/react-window/issues/650) was closed as "not planned" because it points out that a focused element will lose focus when the user scrolls (because the whole item is deleted from the render tree).

On the react-virtualized GitHub page, accessibility issues are not addressed.

I couldn't find any blog post mentioning how virtualization raises accessibility concerns, while it seems to be a widely used solution. As of today, the two libraries mentioned are dependencies of respectively 2313 and 1667 other packages on npm, with a total of more than 3M downloads weekly.

## Optimization is about compromise

Optimization is about compromise. But it's not performance vs accessibility unless developers and designers voluntarily lock all other dimensions to treat it as a binary trade-off.

The most accessible solution tends to be the one that uses the native power of the platform. This is because an accessible solution is one for which browsers and assistive technologies work well together and follow the underlying platform specs. Thus pursuing accessibility often means reducing performance costs.

Yet I've noticed that optimizing without caring about accessibility often leads to over-engineered solutions that end up worse for the user.

That's what I felt when watching the virtualization from the Frontend Masters course: I learned a lot during the course, but if an engineer in my team suggested that JS-intensive solution to fix a render performance bottleneck, I'd push back (starting with "why not pagination?" or "why is there so many elements in the DOM that we cannot render them all?").

But I get it, for an engineer virtualization is a satisfying solution to build. And alternatives may feel frustrating to some because they are an attempt to get out of the accessibility vs performance opposition. Also developers often try to find technical solutions to an already established UI design.

Let's push back on the default adoption of virtualization and let's address accessibility when considering this pattern.
