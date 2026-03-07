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
                primary: {
                    50: '#f0f9fa',
                    100: '#d9f0f2',
                    200: '#afe1e6',
                    300: '#7ccbd4',
                    400: '#48a8b8',
                    500: '#2d8999',
                    600: '#25707f',
                    700: '#225b68',
                    800: '#214b56',
                    900: '#1f4049',
                },
                sage: {
                    50: '#f4f7f4',
                    100: '#e5ebe5',
                    200: '#cedbcc',
                    300: '#adc0aa',
                    400: '#87a283',
                    500: '#698465',
                    600: '#52684f',
                    700: '#425340',
                    800: '#384436',
                    900: '#303a2f',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
};
