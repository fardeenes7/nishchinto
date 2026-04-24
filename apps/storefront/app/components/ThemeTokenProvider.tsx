"use client";

import React from "react";

interface StoreTheme {
    theme_id: string;
    aesthetic_overrides: Record<string, any>;
    active_components: Record<string, any>;
    typography: Record<string, any>;
}

interface ThemeTokenProviderProps {
    theme: StoreTheme | null;
}

export function ThemeTokenProvider({ theme }: ThemeTokenProviderProps) {
    if (!theme) return null;

    // Base theme defaults based on theme_id
    let baseTokens: Record<string, string> = {};

    switch (theme.theme_id) {
        case "bold":
            baseTokens = {
                "--radius": "0rem",
                "--primary": "0 0% 9%", // Black
                "--primary-foreground": "0 0% 98%",
            };
            break;
        case "elegance":
            baseTokens = {
                "--radius": "1rem",
                "--primary": "20 14.3% 4.1%",
                "--primary-foreground": "60 9.1% 97.8%",
            };
            break;
        case "urban":
            baseTokens = {
                "--radius": "0.3rem",
                "--primary": "142.1 76.2% 36.3%", // Greenish
                "--primary-foreground": "355.7 100% 97.3%",
            };
            break;
        case "minimalist":
        default:
            baseTokens = {
                "--radius": "0.5rem",
                "--primary": "240 5.9% 10%",
                "--primary-foreground": "0 0% 98%",
            };
            break;
    }

    // Apply aesthetic overrides from DB
    const overrides = theme.aesthetic_overrides || {};
    if (overrides.primaryColor) {
        baseTokens["--primary"] = overrides.primaryColor;
    }
    if (overrides.radius) {
        baseTokens["--radius"] = overrides.radius;
    }

    // Typography rules (injecting directly to body class or CSS root)
    const typography = theme.typography || {};
    const headingFont = typography.heading || "Inter, sans-serif";
    const bodyFont = typography.body || "Inter, sans-serif";

    // Build standard inline CSS string
    let cssString = `:root {`;
    for (const [key, value] of Object.entries(baseTokens)) {
        cssString += `\n  ${key}: ${value};`;
    }
    cssString += `\n  --font-heading: "${headingFont}";`;
    cssString += `\n  --font-body: "${bodyFont}";`;
    cssString += `\n}\n`;

    cssString += `
        body {
            font-family: var(--font-body);
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
        }
    `;

    return <style dangerouslySetInnerHTML={{ __html: cssString }} />;
}
