import { twMerge } from 'tailwind-merge'

// Joins class names, skipping falsy ones. When two Tailwind classes conflict
// (e.g. bg-indigo-600 and bg-red-600), the later one wins.
export const cn = twMerge
