import templates from "@/templates/templates";
import joinValidStrings from "@/utils/joinValidStrings";
import { generateObject } from "ai";
import { ZodObject } from "zod";
import aiModel from "./aiModel";

const AI_INSTRUCTION = "Analyze the following file and extract all its data.";

const MOCKED = process.env.MOCKED === "true";

//TODO: mieux gérer les erreurs
export async function POST(request: Request) {
  /** Vérification des entrées */
  let template, file, context;
  try {
    const formData = await request.formData();
    file = formData.get("file") as File;
    context = (formData.get("context") as string) || undefined;
    const templateKey = formData.get("template") as keyof typeof templates;
    template = templates[templateKey];
    if (!file) throw new Error("Aucun fichier présent dans la requête");
    if (!templateKey) throw new Error("Aucun template présent dans la requête");
    if (!template) throw new Error("Aucun template valide dans la requête");
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 400 });
  }

  /** Conversion du fichier en JSON (via IA) */
  let generatedJsonDocument;
  try {
    generatedJsonDocument = MOCKED
      ? template.mock
      : await fileToJsonDocument({
          file,
          context: joinValidStrings([template.context, context], "\n\n"),
          schema: template.schema,
        });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }

  /** Conversion du JSON en template */
  try {
    const validatedDocument = template.schema.parse(generatedJsonDocument);
    //@ts-expect-error validatedDocument is in the proper type (comes from the same template)
    const blob = await template.render(validatedDocument);
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Generate ppt when there is a response
    return new Response(buffer, {
      status: 200,
      //@ts-expect-error validatedDocument is in the proper type (comes from the same template)
      headers: { filename: template.filename(validatedDocument) },
    });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}

type FileToJsonDocumentProps = {
  file: File;
  context?: string;
  schema: ZodObject;
};
async function fileToJsonDocument({
  file,
  context,
  schema,
}: FileToJsonDocumentProps) {
  const fileDataUrl = await fileToBase64(file);
  try {
    const result = await generateObject({
      model: aiModel,
      system: context,
      schema,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: AI_INSTRUCTION },
            { type: "file", data: fileDataUrl, mediaType: file.type },
          ],
        },
      ],
    });

    return result.object;
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}

async function fileToBase64(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  // Convert the file's arrayBuffer to a Base64 data URL
  const uint8Array = new Uint8Array(arrayBuffer);
  const charArray = Array.from(uint8Array, (byte) => String.fromCharCode(byte));
  const binaryString = charArray.join("");
  const base64Data = btoa(binaryString);
  return `data:${file.type};base64,${base64Data}`;
}
