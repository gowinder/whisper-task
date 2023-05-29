function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: ['responsive', 'motion-safe', 'motion-reduce'],
      colors: {
        primary: withOpacity('--color-primary'),
        primaryfront: withOpacity('--color-primary-front'),
        secondary: withOpacity('--color-secondary'),
        secondaryfront: withOpacity('--color-secondary-front'),
        base: withOpacity('--color-base'),
        basefront: withOpacity('--color-base-front'),
        accent: withOpacity('--color-acent'),
        neutral: withOpacity('--color-neutral'),
        info: withOpacity('--color-info'),
        success: withOpacity('--color-success'),
        warning: withOpacity('--color-warning'),
        error: withOpacity('--color-error'),
      },
    },
  },
  plugins: [],
};
