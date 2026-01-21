import { defineTemplate } from "../utils";
import mock from "./mocks/document.json";
import render from "./render";
import schema from "./schema";

export default defineTemplate({
  label: "Fichier texte",
  filename: (document) => `${document.sanitizedSubject}.txt`,
  schema,
  render,
  mock,
});
