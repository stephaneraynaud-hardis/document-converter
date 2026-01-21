import joinValidStrings from "./joinValidStrings";

export default function classNames(
  ...strings: (string | boolean | undefined | null)[]
) {
  return joinValidStrings(strings, " ");
}
