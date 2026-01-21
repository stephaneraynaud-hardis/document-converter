import { defineTemplate } from "../utils";
import mock from "./mocks/rka.json";
import render from "./render";
import schema from "./schema";

export default defineTemplate({
  label: "CV Hardis (Powerpoint)",
  filename: (dataDocument) => `CV_${dataDocument.anonymizedName}.pptx`,
  context: `Dans le cadre d'un appel d'offre, tu examines et retranscris les CV avec la sémantique du monde du développement web.`,
  schema,
  render,
  mock,
});
