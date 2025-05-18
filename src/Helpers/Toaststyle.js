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
  shadow-xl hover:shadow-2xl hover:scale-105
  focus:ring-2 focus:ring-offset-2
  toast-slide-in opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]
  bg-opacity-95 backdrop-blur-md
  bg-gradient-to-r from-orange-600 to-orange-500
  dark:from-orange-700 dark:to-orange-600
  text-white
`;

// Toast styles for each type
const toastStyles = {
  error: {
    style: twStyle(`
      ${baseStyles}
      bg-gradient-to-r from-red-600 to-rose-600
      dark:from-red-700 dark:to-rose-700
      border-l-4 border-red-600
      focus:ring-red-600
      shadow-[0_0_10px_rgba(253,29,29,0.3)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#E1306C", // Purple-Red
    },
  },
  success: {
    style: twStyle(`
      ${baseStyles}
      bg-gradient-to-r from-yellow-500 to-amber-300
      dark:from-yellow-600 dark:to-amber-400
      border-l-4 border-yellow-500
      focus:ring-yellow-500
      shadow-[0_0_10px_rgba(252,175,69,0.3)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#FFDC80", // Light Yellow
    },
  },
  info: {
    style: twStyle(`
      ${baseStyles}
      bg-gradient-to-r from-blue-600 to-indigo-600
      dark:from-blue-700 dark:to-indigo-700
      border-l-4 border-blue-600
      focus:ring-blue-600
      shadow-[0_0_10px_rgba(64,93,230,0.3)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#5B51D8", // Blue
    },
  },
  warning: {
    style: twStyle(`
      ${baseStyles}
      bg-gradient-to-r from-orange-500 to-amber-600
      dark:from-orange-600 dark:to-amber-700
      border-l-4 border-orange-500
      focus:ring-orange-500
      shadow-[0_0_10px_rgba(247,119,55,0.3)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#F56040", // Dark Orange
    },
  },
  loading: {
    style: twStyle(`
      ${baseStyles}
      bg-gradient-to-r from-purple-600 to-pink-600
      dark:from-purple-700 dark:to-pink-700
      border-l-4 border-purple-600
      focus:ring-purple-600
      shadow-[0_0_10px_rgba(131,58,180,0.3)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#C13584", // Dark Pink
    },
  },
  compact: {
    style: twStyle(`
      rounded-lg p-4 text-sm font-medium font-inter
      transition-all duration-300 ease-in-out
      flex items-center gap-2 max-w-xs mx-auto my-2
      shadow-lg hover:shadow-xl hover:scale-105
      focus:ring-2 focus:ring-offset-1
      toast-slide-in opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]
      bg-opacity-90 backdrop-blur-md
      bg-gradient-to-r from-yellow-400 to-orange-400
      dark:from-yellow-500 dark:to-orange-500
      text-white
      border-l-3 border-yellow-400
      focus:ring-yellow-400
      shadow-[0_0_8px_rgba(252,175,69,0.2)]
    `),
    iconTheme: {
      primary: "#fff",
      secondary: "#F77737", // Orange
    },
  },
};

export default toastStyles;