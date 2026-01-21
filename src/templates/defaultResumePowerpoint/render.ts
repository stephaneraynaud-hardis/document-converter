import {
  Experience,
  Formation,
  Project,
  Resume,
} from "@/templates/defaultResumePowerpoint/schema";
import joinValidStrings from "@/utils/joinValidStrings";
import { StaticImageData } from "next/image";
import PptxGenJS from "pptxgenjs";

import { ServerPath } from "@/utils/serverPath";
import IconBusinessCase from "./assets/icon_businesscase.png";
import IconCertifications from "./assets/icon_certifications.png";
import IconCompetences from "./assets/icon_competences.png";
import IconTools from "./assets/icon_tools.png";
import Logo from "./assets/logo.png";
import styles from "./styles";

// Server replace images urls
const sp = new ServerPath(__dirname);
Logo.src = sp.src("./assets/logo.png");
IconBusinessCase.src = sp.src("./assets/icon_businesscase.png");
IconCertifications.src = sp.src("./assets/icon_certifications.png");
IconCompetences.src = sp.src("./assets/icon_competences.png");
IconTools.src = sp.src("./assets/icon_tools.png");

// Consts for splitting document on multiple pages (see splitResume function)
const NUMBER_OF_LINES_ON_FIRST_PAGE = 22;
const NUMBER_OF_LINES_PER_PAGE = 40;

export default function render(dataDocument: Resume) {
  const presentation = new PptxGenJS();

  const chunks = splitResume(dataDocument);

  chunks.forEach((chunkedResume, index) => {
    const onFirstPage = index === 0;
    const slide = presentation.addSlide();
    const pptx = { presentation, slide };

    slide.addShape(presentation.ShapeType.rect, styles.aside);
    slide.addImage({
      path: Logo.src,
      w: Logo.width,
      h: Logo.height,
      ...styles.logo,
    });

    /* ASIDE */
    const asideXPosition = 0.2;
    addAsideBlock(
      pptx,
      { title: chunkedResume.anonymizedName, content: chunkedResume.title },
      {
        position: { x: asideXPosition, y: 0.5 },
        contentStyle: styles.asideContentJobTitle,
      }
    );

    if (onFirstPage) {
      addAsideBlock(
        pptx,
        {
          title: "Informations générales",
          content: `${chunkedResume.yearsOfExperience} ans d'expérience.`,
        },
        { position: { x: asideXPosition, y: 1.5 } }
      );

      addAsideBlock(
        pptx,
        {
          title: "Résumé / Parcours",
          content: chunkedResume.anonymizedSummary,
        },
        { position: { x: asideXPosition, y: 2.5 } }
      );
    }

    /* CONTENT */
    const contentXPosition = 3;
    addContentTitle(
      pptx,
      { title: "Expériences principales", icon: IconBusinessCase },
      { position: { x: contentXPosition, y: 0.3 } }
    );

    addExperiences(pptx, chunkedResume.experiences, {
      position: { x: contentXPosition, y: 0.6, w: 6.8 },
    });

    if (onFirstPage) {
      /* SKILLS */
      const skillsYPosition = 4;
      const skillsW = [2.9, 2, 2];
      const skillsXPadding = 0.1;
      addSkillBlock(
        pptx,
        {
          title: "Formations & certifications",
          icon: IconCertifications,
          texts: chunkedResume.formations.flatMap(toFormationTexts),
        },
        { position: { x: contentXPosition, y: skillsYPosition, w: skillsW[0] } }
      );
      addVerticalDelimiter(pptx, {
        position: {
          x: contentXPosition + skillsW[0] + 0.5 * skillsXPadding,
          y: skillsYPosition,
          h: 1.5,
        },
      });
      addSkillBlock(
        pptx,
        {
          title: "Compétences",
          icon: IconCompetences,
          texts: chunkedResume.skills.flatMap(toSkillTexts),
        },
        {
          position: {
            x: contentXPosition + skillsW[0] + skillsXPadding,
            y: skillsYPosition,
            w: skillsW[1],
          },
        }
      );
      addVerticalDelimiter(pptx, {
        position: {
          x: contentXPosition + skillsW[0] + skillsW[1] + 1.5 * skillsXPadding,
          y: skillsYPosition,
          h: 1.5,
        },
      });
      addSkillBlock(
        pptx,
        {
          title: "Outils maîtrisés",
          icon: IconTools,
          texts: chunkedResume.tools.flatMap(toSkillTexts),
        },
        {
          position: {
            x: contentXPosition + skillsW[0] + skillsW[1] + 2 * skillsXPadding,
            y: skillsYPosition,
            w: skillsW[2],
          },
        }
      );
    }
  });

  return presentation.write({ outputType: "blob" }) as Promise<Blob>;
}

function newLine({ x, y }: PptxGenJS.PositionProps) {
  return {
    x,
    y: Number(y) + 0.15,
  };
}

type PptxTools = {
  presentation: PptxGenJS;
  slide: PptxGenJS.Slide;
};

function addAsideBlock(
  { presentation, slide }: PptxTools,
  { title, content }: { title: string; content: string },
  {
    position,
    contentStyle: contentStyleOverride = {},
  }: {
    position: PptxGenJS.PositionProps;
    contentStyle?: PptxGenJS.TextProps;
  }
) {
  const positionTitle = position;
  const positionDelimiter = newLine(positionTitle);
  const positionContent = newLine(positionDelimiter);

  const titleStyle = {
    ...positionTitle,
    ...styles.asideTitle,
  };
  const delimiterStyle = {
    ...{ x: Number(positionDelimiter.x) + 0.1, y: positionDelimiter.y },
    ...styles.delimiter,
  };
  const contentStyle = {
    ...positionContent,
    ...styles.asideContent,
    ...contentStyleOverride,
  };

  slide.addText(title.toUpperCase(), titleStyle);
  slide.addShape(presentation.ShapeType.line, delimiterStyle);
  slide.addText(content, contentStyle);
}

function addContentTitle(
  { presentation, slide }: PptxTools,
  { title, icon }: { title: string; icon: StaticImageData },
  { position }: { position: PptxGenJS.PositionProps }
) {
  const positionIcon = position;
  const positionTitle = { x: Number(position.x) + 0.28, y: position.y };
  const positionDelimiter = newLine(positionTitle);

  const titleStyle = {
    ...positionTitle,
    ...styles.contentTitle,
  };
  const delimiterStyle = {
    ...{ x: Number(positionDelimiter.x) + 0.1, y: positionDelimiter.y },
    ...styles.delimiter,
  };
  const iconStyle = {
    ...{ x: positionIcon.x, y: Number(positionIcon.y) - 0.1 },
    ...{ w: icon.width, h: icon.height },
    ...styles.icon,
  };

  slide.addImage({ path: icon.src, ...iconStyle });
  slide.addText(title.toUpperCase(), titleStyle);
  slide.addShape(presentation.ShapeType.line, delimiterStyle);
}

function addExperiences(
  { slide }: PptxTools,
  experiences: Experience[],
  { position }: { position: PptxGenJS.PositionProps }
) {
  slide.addText([...experiences.flatMap(toExperienceTexts)], {
    ...position,
    x: Number(position.x) - 0.1,
    y: position.y,
    valign: "top",
  });
}

function toExperienceTexts(experience: Experience): PptxGenJS.TextProps[] {
  const years = joinValidStrings(
    [
      String(experience.years[0]),
      !!experience.years[1] && String(experience.years[1]),
    ],
    " — "
  );
  return [
    {
      text: joinValidStrings(
        [years, experience.title, experience.company],
        " | "
      ),
      options: { ...styles.experienceTitle, breakLine: true },
    },
    ...experience.projects.flatMap(toProjectTexts),
  ];
}

function toProjectTexts(project: Project): PptxGenJS.TextProps[] {
  const listFormatter = new Intl.ListFormat();

  return [
    {
      text: project.context,
      options: { ...styles.projectContext, breakLine: true },
    },
    ...project.actions.flatMap(toActionTexts),
    ...(project.environment && project.environment.length > 0
      ? [
          {
            text:
              "Environnement : " + listFormatter.format(project.environment),
            options: { ...styles.projectEnvironment, breakLine: true },
          },
        ]
      : []),
  ];
}

function toActionTexts(action: string): PptxGenJS.TextProps[] {
  return [{ text: action, options: { ...styles.action, breakLine: true } }];
}

function splitResume(dataDocument: Resume): Resume[] {
  return dataDocument.experiences.reduce(
    ({ totalLinesCurrentPage: _totalLines, resumes }, experience) => {
      const numberOfLines = toExperienceTexts(experience).length;
      const totalLinesCurrentPage = _totalLines + numberOfLines;

      const onFirstPage = resumes.length <= 1;
      const maxNumberOfLines = onFirstPage
        ? NUMBER_OF_LINES_ON_FIRST_PAGE
        : NUMBER_OF_LINES_PER_PAGE;

      const lastResume = resumes[resumes.length - 1];

      if (!lastResume || totalLinesCurrentPage >= maxNumberOfLines) {
        // If no resume or too much lines, create a new resume and reset totalLinesCount
        return {
          totalLinesCurrentPage: numberOfLines,
          resumes: [...resumes, { ...dataDocument, experiences: [experience] }],
        };
      }

      // Reuse existing experiences
      return {
        totalLinesCurrentPage: totalLinesCurrentPage,
        resumes: [
          ...resumes.slice(0, -1),
          {
            ...dataDocument,
            experiences: [...lastResume.experiences, experience],
          },
        ],
      };
    },
    { totalLinesCurrentPage: 0, resumes: [] as Resume[] }
  ).resumes;
}

function addSkillBlock(
  pptx: PptxTools,
  {
    title,
    icon,
    texts,
  }: { title: string; icon: StaticImageData; texts: PptxGenJS.TextProps[] },
  { position }: { position: PptxGenJS.PositionProps }
) {
  const { slide } = pptx;

  addContentTitle(pptx, { title, icon }, { position });

  slide.addText(texts, {
    ...position,
    x: Number(position.x) - 0.1,
    y: Number(position.y) + 0.3,
    valign: "top",
  });
}

function toFormationTexts(formations: Formation): PptxGenJS.TextProps[] {
  return [
    {
      text: formations.year + " | ",
      options: { ...styles.formationTitle, breakLine: false },
    },
    {
      text: formations.title,
      options: { ...styles.formationText, breakLine: true },
    },
  ];
}

function toSkillTexts(skill: string): PptxGenJS.TextProps[] {
  return [
    {
      text: skill,
      options: {
        ...styles.skillText,
        breakLine: true,
      },
    },
  ];
}

function addVerticalDelimiter(
  { slide, presentation }: PptxTools,
  { position }: { position: PptxGenJS.PositionProps }
) {
  const delimiterStyle = {
    ...{ x: Number(position.x) - 0.05, y: position.y, h: position.h },
    ...styles.verticalDelimiter,
  };
  slide.addShape(presentation.ShapeType.line, delimiterStyle);
}
