# Convertisseur de documents

## Principes

Le convertisseur de documents permet d'extraire des données de n'importe quel format vers un template déterminé. Il utilise l'intelligence artificielle pour extraire les données. La restitution dans un template donné nécessite un développement manuel pour assurer une qualité constante des présentations.

## Architecture

- src/ - Sources du projet
  - app/ - Pages de NextJS
    - api/generate/ - Endpoint REST pour l'appel au LLM d'extraction de données
  - common/ - Composants communs
  - features/ - Fonctionnalités
    - converter/ - Composants liés à la page de conversion
  - templates/ - Templates de restitution des données (un dossier par template)
  - utils/ - Fonctions utilitaires

### Templates

- monTemplate/ - Dossier du template
  - render.ts - Fonction de rendu du template, installer des libs si nécessaire
  - schema.ts - Schéma des données souhaitées pour l'extraction
  - template.ts - Définition du template
  - mocks/ - Données fictives pour test

## Améliorations

- Certains fichiers en entrée ne sont pas pris en compte. Cela fonctionne bien avec du texte, avec des pdf.
- Les erreurs ne sont pas bien gérées (notamment les mauvais formats d'entrée)

## Lancement du projet

Editer le fichier .env.local pour y mettre les clés d'API pour utiliser l'intelligence artificielle. Voir https://ai-sdk.dev/providers/ai-sdk-providers pour configurer correctement le provider IA. (Le fichier où est configurée l'IA est : `src/app/api/generate/aiModel.ts`).

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) avec le navigateur.
