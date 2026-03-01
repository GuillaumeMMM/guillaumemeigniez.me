import markdownIt from "markdown-it";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import sitemap from "@quasibit/eleventy-plugin-sitemap";

export default function (eleventyConfig) {
    eleventyConfig.addWatchTarget("./styles/");
    eleventyConfig.addWatchTarget("./assets");
    eleventyConfig.addPassthroughCopy("./assets");

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
            base: "https://guillaumemeigniez.me/",
            author: {
                name: "Guillaume Meigniez",
            }
        }
    });

    eleventyConfig.addPlugin(sitemap, {
        sitemap: {
            hostname: "https://guillaumemeigniez.me",
        },
    });

    eleventyConfig.addFilter("date", date => {
        return new Date(date).toLocaleString('en-US', { day: 'numeric', month: "short", year: 'numeric' });
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

    const defaultHeadingClose =
        md.renderer.rules.heading_close ||
        function (tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

    md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
        const token = tokens[idx];

        const level = Math.min(Number(token.tag.slice(1)) + 1, 6);
        token.tag = `h${level}`;

        token.attrJoin("class", `mdf-title${level}`);

        return defaultHeadingOpen(tokens, idx, options, env, self);
    };

    md.renderer.rules.heading_close = function (tokens, idx, options, env, self) {
        const token = tokens[idx];

        const level = Math.min(Number(token.tag.slice(1)) + 1, 6);
        token.tag = `h${level}`;

        return defaultHeadingClose(tokens, idx, options, env, self);
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