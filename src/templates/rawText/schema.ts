import { z } from "zod";

const DocumentSchema = z.object({
  text: z
    .string()
    .describe(
      "Document complet, non transformé, non formatté, au format texte."
    ),
  sanitizedSubject: z
    .string()
    .describe(
      "Titre ou sujet pertinent du document, sans accents, avec underscore, pour utiliser comme nom de fichier."
    ),
});

export default DocumentSchema;
export type Document = z.infer<typeof DocumentSchema>;
