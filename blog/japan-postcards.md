---
title: Japanese Postcards
tags: blog
date: 2026-10-20 00:00:00
description: Along my trip across Japan I collected a bunch of postcards from places I visited. I got them in museums, in tourist shops or in second-hand bookstores.
layout: layouts/post.njk
---

Along my trip across Japan I collected a bunch of postcards from places I visited. I got them in museums, in tourist shops or in second-hand bookstores. I sent some to friends and family, but most of them I kept as souvenirs for this year of travelling. I built a small website to showcase them in an interactive way organized by category.

## Very cool cities

Osaka, Nagasaki, Kobe, Sapporo, Aomori, Fukushima...

<iframe src="https://postcards.guillaumemeigniez.me?hideTitle=true&cardsIds=9,16,20,23&postcardSizeRatio=0.5&containerRestrictionRatio=0.5" title="Japanese postcards regarding cool cities I visited"></iframe>

## Favorite activity this year: hiking

Mount Rokko (六甲山) & Mount Hiei (比叡山) in the Kyoto region, Mount Nijou (二丈岳) west of Fukuoka, Mount Aso (阿蘇山) under the rain, Daisetsuzan National Park (大雪山国立公園) and Mount Tarumae (樽前山) in Hokkaido, Mount Yari (槍ヶ岳) + Mount Akaiwa (赤岩岳) + Mount Otensho (大天井岳) on a 4-days bivouac hike in Japanese Alps, and Mount Fuji (富士山).

<iframe src="https://postcards.guillaumemeigniez.me?hideTitle=true&cardsIds=2,5,10,11,12,14,15,17,22,24&postcardSizeRatio=0.5&containerRestrictionRatio=0.5" title="Japanese postcards regarding hikes I did"></iframe>

## Museums & shrines

<iframe src="https://postcards.guillaumemeigniez.me?hideTitle=true&cardsIds=1,4,6,8,13,18,21&postcardSizeRatio=0.5&containerRestrictionRatio=0.5" title="Japanese postcards regarding museums and shrines I visited"></iframe>

## Islands and othe landscapes

<iframe src="https://postcards.guillaumemeigniez.me?hideTitle=true&cardsIds=3,7,19,25,26&postcardSizeRatio=0.5&containerRestrictionRatio=0.5" title="Japanese postcards regarding other places I went"></iframe>

<style>
    iframe {
        width: calc(100vw - 2rem);
        margin: 1rem 0;
        margin-left: calc(-50vw + 300px + 1rem);
        height: 70vh;
        border: 1px solid var(--mdf-color-border-default);
        border-radius: 1rem;
        overflow: hidden;
    }

    .small {
        display: none;
    }

    @media (max-width: 700px) {
        iframe {
            width: 100%;
            margin-left: 0;
        }

        .big {
            display: none;
        }

        .small {
            display: block;
        }
    }
</style>

<script defer>
    const sScreen = window.matchMedia('(max-width: 600px)').matches;
    if (sScreen) {
        Array.from(document.querySelectorAll('iframe')).forEach(iframe => {
            const src = iframe.src.replace('postcardSizeRatio=0.5', 'postcardSizeRatio=0.35');
            iframe.setAttribute('src', src);
        })
    }
</script>
