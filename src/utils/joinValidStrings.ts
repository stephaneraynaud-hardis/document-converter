export default function joinValidStrings(
  strings: (string | boolean | undefined | null)[],
  separator: string
) {
  return strings.filter(Boolean).join(separator);
}
