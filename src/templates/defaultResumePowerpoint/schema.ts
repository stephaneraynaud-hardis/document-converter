import { z } from "zod";

const FormationSchema = z.object({
  year: z.number().describe("Année d'obtention du diplôme"),
  title: z
    .string()
    .describe(
      "Nom de la certification ou de la formation. Utiliser les acronymes autant que possible."
    ),
  location: z.string().describe("Emplacement géographique"),
});

const ProjectSchema = z.object({
  context: z
    .string()
    .describe(
      "Intitulé de la mission, légèrement verbeux, maximum 255 caractères"
    ),
  actions: z
    .array(z.string().describe("Action de maximum 120 caractères"))
    .describe(
      "Liste des actions réalisées pendant la mission. Garder l'exhaustivité des actions sur les deux premières expériences, rester pertinent, très légèrement verbeux. Les actions peuvent avoir un peu de contexte"
    ),
  environment: z
    .array(z.string())
    .optional()
    .describe("Environnement technique, optionnel, remplir si intéressant"),
});

const ExperienceSchema = z.object({
  years: z
    .array(z.number().nullable())
    .describe(
      "Deux années : Année de début (obligatoire) et Année de fin (facultative)"
    ),
  title: z.string().describe("Intitulé du poste"),
  company: z.string().describe("Nom de l'entreprise"),
  location: z.string().optional().describe("Emplacement géographique"),
  projects: z.array(ProjectSchema),
});

const ResumeSchema = z.object({
  //  fullName: z.string().describe("Nom complet de la personne"),
  anonymizedName: z
    .string()
    .describe(
      "Nom complet, anonymisé en trois lettres, en majuscules. Première lettre du prénom + deux premières lettres du nom."
    ),
  title: z.string().describe("Intitulé du poste"),
  yearsOfExperience: z
    .number()
    .describe("Nombre d'années d'expérience dans le domaine"),
  //    summary: z.string().describe('Résumé des qualités et expériences'),
  anonymizedSummary: z
    .string()
    .describe(
      "Résumé des qualités et expériences. A la troisième personne, avec le nom anonymisé plutôt que le nom réel. 1 paragraphe, maximum 400 caractères."
    ),
  experiences: z
    .array(ExperienceSchema)
    .describe(
      "Liste complète des expériences, triées de la plus récente à la plus ancienne. Les deux premières expériences doivent être plus verbeuses que les autres."
    ),
  formations: z
    .array(FormationSchema)
    .describe(
      "Maximum 4 formations ou certifications. Prioriser les certifications. Utiliser les acronymes autant que possible pour réduire les intitulés."
    ),
  skills: z
    .array(z.string().describe("Aptitude sociale"))
    .describe(
      "Aptitudes sociales requises pour le poste (créativité, adaptation, management...). Maximum 9."
    ),
  tools: z
    .array(
      z.string().describe("Outil maîtrisé, simple, acronymes de préférence")
    )
    .describe("Maximum 10 outils"),
});

export default ResumeSchema;
export type Resume = z.infer<typeof ResumeSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Formation = z.infer<typeof FormationSchema>;
