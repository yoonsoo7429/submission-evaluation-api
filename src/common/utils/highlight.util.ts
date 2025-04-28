export function generateHighlightText(
  submitText: string,
  highlights: string[],
): string {
  let result = submitText;

  if (!Array.isArray(highlights)) {
    highlights = [];
  }

  for (const highlight of highlights) {
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedHighlight, 'g');
    result = result.replace(regex, `<b>${highlight}</b>`);
  }

  return result;
}
