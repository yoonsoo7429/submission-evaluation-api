export function parseCleanJson(content: string): any {
  const cleanedContent = content
    .replace(/^```json\s*/, '')
    .replace(/^```\s*/, '')
    .replace(/\s*```$/, '');

  return JSON.parse(cleanedContent);
}
