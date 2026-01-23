import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Block } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Recursively regenerate IDs for a block and all its nested elements.
 * This is used when pasting a copied widget to avoid duplicate IDs.
 */
export function regenerateIds<T extends Block>(block: T): T {
  const newBlock = {
    ...block,
    id: crypto.randomUUID(),
  };

  if (newBlock.elements && Array.isArray(newBlock.elements)) {
    newBlock.elements = newBlock.elements.map((element: Block) => regenerateIds(element));
  }

  return newBlock;
}
