/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0d2b22',
                    'dark-mid': '#1a4a38',
                    accent: '#7ecab0',
                    'accent-light': '#a8e6cf',
                    ivory: '#f9f7f4',
                    muted: '#666',
                    card: '#ffffff',
                },
            },
            fontFamily: {
                playfair: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-dm-sans)', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-premium': 'linear-gradient(135deg, #0d2b22, #1a4a38)',
            },
        },
    },
    plugins: [],
};
