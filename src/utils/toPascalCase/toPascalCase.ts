export function toPascalCase(str: string): string {
  return str.replace(/(?:^|_|-)(\w)/g, (_, char) => char.toUpperCase());
}
