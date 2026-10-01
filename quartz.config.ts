import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "SPL Class Notes",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "fyxss.github.io/spl-class-notes",
    ignorePatterns: ["private", "templates", ".obsidian", "*.pdf", "*.bak"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          // Shimmering Focus Light Theme
          light: "#fcfdfe",
          lightgray: "#eff2f7",
          gray: "#98a5bc",
          darkgray: "#20242c",
          dark: "#111620",
          secondary: "#1396a0",
          tertiary: "#5460ab",
          highlight: "rgba(19, 150, 160, 0.14)",
          textHighlight: "rgba(220, 56, 143, 0.25)",
        },
        darkMode: {
          // Obsidianite Dark Theme
          light: "#100e17",
          lightgray: "#1c1926",
          gray: "#625e7a",
          darkgray: "#c5c5d2",
          dark: "#0fb6d6",
          secondary: "#6bcafb",
          tertiary: "#f4569d",
          highlight: "rgba(14, 210, 247, 0.15)",
          textHighlight: "rgba(244, 86, 157, 0.35)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
