export function generateHighlightText(
  submitText: string,
  highlights: string[],
): string {
  let result = submitText;

  for (const highlight of highlights) {
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 특수문자 이스케이프
    const regex = new RegExp(escapedHighlight, 'g');
    result = result.replace(regex, `<b>${highlight}</b>`);
  }

  return result;
}
