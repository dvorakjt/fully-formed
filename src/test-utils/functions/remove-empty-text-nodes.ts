/**
 * Removes empty text nodes created by line breaks in order to more
 * predictably test whether a {@link NodeList} contains expected elements and/or
 * text.
 *
 * @param nodes - A {@link NodeList} to filter.
 * @returns An array including all {@link Node}s except for empty text nodes.
 */
export function removeEmptyTextNodes(nodes: NodeList): Node[] {
  return Array.from(nodes).filter(node => {
    return node.nodeName !== '#text' || !!node.textContent?.trim();
  });
}
