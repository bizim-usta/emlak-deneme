import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(price);
}

export const PROPERTY_TYPES = {
  SALE: 'Satılık',
  RENT: 'Kiralık',
};

export const ROOM_COUNTS = [
  '1+0', '1+1', '2+1', '3+1', '4+1', '5+1', 'Villa'
];
