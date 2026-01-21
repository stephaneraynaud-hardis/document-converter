import { Document } from "./schema";

export default async function render(document: Document) {
  return await new Blob([document.text]);
}
