import PptxGenJS from "pptxgenjs";

const primaryColor = "000094";
const secondaryColor = "0053ff";

const commonStyles = {
  fontDefault: {
    fontSize: 9,
    fontFace: "Century Gothic",
  },
  fontSmall: { fontSize: 8, lineSpacing: 8, fontFace: "Century Gothic" },
  fontColorAside: { color: "FFFFFF" },
  fontColorPrimary: { color: primaryColor },
  fontColorSecondary: { color: secondaryColor },
  fontTitle: { bold: true },
};

const styles = {
  logo: {
    ...{ x: 8.1, y: 0.1 },
    sizing: { type: "contain", w: 1.8, h: 0.85 },
  } as PptxGenJS.ImageProps,

  aside: {
    ...{ x: 0, y: 0, w: 2.8, h: "100%" },
    fill: { color: primaryColor },
  } as PptxGenJS.ShapeProps,
  asideTitle: {
    ...commonStyles.fontDefault,
    ...commonStyles.fontColorAside,
    ...commonStyles.fontTitle,
  } as PptxGenJS.TextProps,
  delimiter: {
    ...{ w: 0.4, h: 0 },
    line: { color: secondaryColor, width: 1.5 },
  } as PptxGenJS.ShapeLineProps,
  asideContent: {
    ...{ w: 2.4, valign: "top" },
    ...commonStyles.fontSmall,
    ...commonStyles.fontColorAside,
  } as PptxGenJS.TextProps,
  asideContentJobTitle: {
    italic: true,
  } as PptxGenJS.TextProps,

  contentTitle: {
    ...commonStyles.fontDefault,
    ...commonStyles.fontTitle,
    ...commonStyles.fontColorPrimary,
  } as PptxGenJS.TextProps,
  icon: {
    sizing: { type: "contain", w: 0.28, h: 0.28 },
  } as PptxGenJS.ImageProps,

  experienceTitle: {
    ...commonStyles.fontDefault,
    ...commonStyles.fontColorPrimary,
    bold: true,
    paraSpaceBefore: 3,
    paraSpaceAfter: 1.5,
  },
  projectContext: {
    ...commonStyles.fontSmall,
    ...commonStyles.fontColorSecondary,
    bold: true,
    paraSpaceAfter: 1,
  },
  projectEnvironment: {
    ...commonStyles.fontSmall,
    italic: true,
    paraSpaceBefore: 1.5,
  },
  action: {
    ...commonStyles.fontSmall,
    bullet: { fill: { color: primaryColor }, indent: 10 },
  },

  verticalDelimiter: {
    ...{ w: 0 },
    line: { color: secondaryColor, width: 1.5 },
  } as PptxGenJS.ShapeLineProps,
  formationTitle: {
    ...commonStyles.fontSmall,
    ...commonStyles.fontColorPrimary,
    bold: true,
    paraSpaceAfter: 1.5,
  },
  formationText: {
    ...commonStyles.fontSmall,
    paraSpaceAfter: 1.5,
  },
  skillText: {
    ...commonStyles.fontSmall,
    bullet: { fill: { color: primaryColor }, indent: 15 },
  },
};

export default styles;
