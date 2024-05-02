export function getSelectedOptionValues(element: HTMLSelectElement): string[] {
  return Array.from(element.selectedOptions, option => option.value);
}
