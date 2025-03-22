import defaultTheme from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';
import flowbite from "flowbite/plugin"

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./node_modules/flowbite/**/*.js",
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [daisyui, flowbite],
};
