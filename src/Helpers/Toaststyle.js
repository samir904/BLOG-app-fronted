import { twMerge } from "tailwind-merge";

// Utility function to convert Tailwind classes to a style object
const twStyle = (classes) => ({
  className: twMerge(classes),
});

// Common base styles for all toasts
const baseStyles = `
  rounded-xl p-5 text-base font-medium font-inter
  transition-all duration-300 ease-in-out
  flex items-center gap-3 max-w-sm mx-auto my-3
  shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1
  focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
  opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]
  bg-opacity-90 backdrop-blur-lg
  text-white
  border border-transparent
  bg-clip-padding
`;

// Animation for toast dismissal (optional, requires Tailwind config)
const dismissAnimation = `
  data-[closed]:animate-[fadeOut_0.3s_ease-out_forwards]
`;

// Toast styles for each type
const toastStyles = {
  error: {
    style: twStyle(`
      ${baseStyles}
      ${dismissAnimation}
      bg-gradient-to-r from-purple-600 to-pink-600
      dark:bg-gradient-to-r dark:from-purple-700 dark:to-pink-700
      border-l-4 border-red-500
      focus:ring-red-500
      shadow-[0_0_15px_rgba(239,68,68,0.4)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#EF4444", // Red
    },
  },
  success: {
    style: twStyle(`
      ${baseStyles}
      ${dismissAnimation}
      bg-gradient-to-r from-purple-600 to-pink-600
      dark:bg-gradient-to-r dark:from-purple-700 dark:to-pink-700
      border-l-4 border-green-500
      focus:ring-green-500
      shadow-[0_0_15px_rgba(34,197,94,0.4)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#22C55E", // Green
    },
  },
  info: {
    style: twStyle(`
      ${baseStyles}
      ${dismissAnimation}
      bg-gradient-to-r from-purple-600 to-pink-600
      dark:bg-gradient-to-r dark:from-purple-700 dark:to-pink-700
      border-l-4 border-blue-500
      focus:ring-blue-500
      shadow-[0_0_15px_rgba(59,130,246,0.4)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#3B82F6", // Blue
    },
  },
  warning: {
    style: twStyle(`
      ${baseStyles}
      ${dismissAnimation}
      bg-gradient-to-r from-purple-600 to-pink-600
      dark:bg-gradient-to-r dark:from-purple-700 dark:to-pink-700
      border-l-4 border-orange-500
      focus:ring-orange-500
      shadow-[0_0_15px_rgba(249,115,22,0.4)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#F97316", // Orange
    },
  },
  loading: {
    style: twStyle(`
      ${baseStyles}
      ${dismissAnimation}
      bg-gradient-to-r from-purple-600 to-pink-600
      dark:bg-gradient-to-r dark:from-purple-700 dark:to-pink-700
      border-l-4 border-purple-500
      focus:ring-purple-500
      shadow-[0_0_15px_rgba(139,92,246,0.4)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#8B5CF6", // Purple
    },
  },
  compact: {
    style: twStyle(`
      rounded-lg p-4 text-sm font-medium font-inter
      transition-all duration-300 ease-in-out
      flex items-center gap-2 max-w-xs mx-auto my-2
      shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1
      focus:ring-2 focus:ring-offset-1 focus:ring-opacity-50
      opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]
      bg-opacity-90 backdrop-blur-lg
      bg-gradient-to-r from-purple-600 to-pink-600
      dark:bg-gradient-to-r dark:from-purple-700 dark:to-pink-700
      text-white
      border-l-3 border-purple-500
      focus:ring-purple-500
      shadow-[0_0_10px_rgba(139,92,246,0.3)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#DB2777", // Pink
    },
  },
};

export default toastStyles;