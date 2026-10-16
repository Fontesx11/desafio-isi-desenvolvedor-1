import { normalizeForComparison } from '../../../core/utils/string.utils.js';

export function acronymMatchesName(acronym: string, name: string): boolean {
  const [first, second, third] = acronym.toLowerCase();
  const pattern = new RegExp(`^\\P{L}*${first}.*${second}.*${third}`, 'u');

  return pattern.test(normalizeForComparison(name));
}

export function hasDifferentLetters(acronym: string): boolean {
  return new Set(acronym).size > 1;
}
