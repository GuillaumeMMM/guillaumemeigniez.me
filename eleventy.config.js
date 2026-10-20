import path from "node:path";
import markdownIt from "markdown-it";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import sitemap from "@quasibit/eleventy-plugin-sitemap";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
    eleventyConfig.addWatchTarget("./styles/");
    eleventyConfig.addWatchTarget("./assets");
    eleventyConfig.addPassthroughCopy("./assets");
    eleventyConfig.addPassthroughCopy("./social/**/images");
    //  Browsers request /favicon.ico on their own (a PNG under that name is fine)
    eleventyConfig.addPassthroughCopy({ "./assets/img/favicon-32.png": "favicon.ico" });

    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        htmlOptions: {
            imgAttributes: {
                loading: "lazy",
                decoding: "async",
            },
        },
    });

    eleventyConfig.addPlugin(feedPlugin, {
        type: "atom",
        outputPath: "/blog.xml",
        collection: {
            name: "blog",
            limit: 20,
        },
        metadata: {
            language: "en",
            title: "Guillaume Meigniez Blog",
            subtitle: "Life updates and tech-related thoughts.",
            base: "https://guillaumemeigniez.me/",
            author: {
                name: "Guillaume Meigniez",
            }
        },
    });

    eleventyConfig.addPlugin(feedPlugin, {
        type: "atom",
        outputPath: "/social.xml",
        collection: {
            name: "social",
            limit: 20,
        },
        metadata: {
            language: "en",
            title: "Guillaume Meigniez Social",
            subtitle: "Photos and snippets of my life.",
            base: "https://guillaumemeigniez.me/",
            author: {
                name: "Guillaume Meigniez",
            }
        }
    });

    eleventyConfig.addCollection("sitemapPages", collectionApi => {
        return collectionApi.getAll().filter(item => item.url && item.url.endsWith("/"));
    });

    eleventyConfig.addPlugin(sitemap, {
        sitemap: {
            hostname: "https://guillaumemeigniez.me",
        },
    });

    eleventyConfig.addFilter("date", date => {
        return new Date(date).toLocaleString('en-US', { day: 'numeric', month: "short", year: 'numeric', timeZone: 'UTC' });
    });

    eleventyConfig.addFilter("isoDate", date => {
        return new Date(date).toISOString().slice(0, 10);
    });

    eleventyConfig.addFilter("srcFromInput", (src, inputPath) => {
        return "/" + path.posix.join(path.posix.dirname(inputPath), src);
    });

    eleventyConfig.addFilter("year", date => {
        return new Date(date).getUTCFullYear();
    });

    eleventyConfig.addFilter("dateId", date => {
        return new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
    });

    eleventyConfig.addFilter("toTransitionNamePost", (str) => {
        return `post-${str.toLowerCase().trim().replace(/[^a-z0-9]/g, "-")}`
    });

    eleventyConfig.addFilter("toTransitionNamePublication", (str) => {
        return `publication-${str.toLowerCase().trim().replace(/[^a-z0-9]/g, "-")}`
    });

    eleventyConfig.addFilter("toTransitionNameProject", (str) => {
        return `project-${str.toLowerCase().trim().replace(/[^a-z0-9]/g, "-")}`
    });

    eleventyConfig.addFilter("toTransitionNameProjectImage", (str, index) => {
        return `project-image-${str.toLowerCase().trim().replace(/[^a-z0-9]/g, "-")}-${index}`
    });

    eleventyConfig.addFilter("toTransitionNameImage", (str) => {
        return `image-${str.toLowerCase().trim().replace(/[^a-z0-9]/g, "-")}`
    });

    const md = markdownIt({
        html: true,
        breaks: true,
        linkify: true,
        highlight: str => `<pre class="mdf-code-block"><code>${md.utils.escapeHtml(str)}</code></pre>`
    })

    const defaultInlineCode =
        md.renderer.rules.code_inline ||
        function (tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

    const defaultHeadingOpen =
        md.renderer.rules.heading_open ||
        function (tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

    //  The post title is the page h1, so "##" stays an h2 but is styled one size down
    md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
        const token = tokens[idx];

        const level = Number(token.tag.slice(1));
        token.attrJoin("class", `mdf-title${Math.min(level + 1, 6)}`);

        return defaultHeadingOpen(tokens, idx, options, env, self);
    };

    md.renderer.rules.code_inline = function (tokens, idx, options, env, self) {
        tokens[idx].attrJoin("class", "mdf-code-inline");

        return defaultInlineCode(tokens, idx, options, env, self);
    };

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        tokens[idx].attrPush(["class", "mdf-link"]);

        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.softbreak = function () {
        return "<span class='soft-space'>\n\n</span>";
    };

    md.renderer.rules.bullet_list_open = function (tokens, idx, options, env, self) {
        tokens[idx].attrPush(["class", "mdf-list"]);
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.list_item_open = function (tokens, idx, options, env, self) {
        tokens[idx].attrPush(["class", "mdf-list-item"]);
        return self.renderToken(tokens, idx, options);
    };

    eleventyConfig.addTransform("trim-sitemap", function (content, outputPath) {
        if (outputPath && outputPath.endsWith("sitemap.xml")) {
            return content.trim();
        }
        return content;
    });

    eleventyConfig.setLibrary("md", md);
};