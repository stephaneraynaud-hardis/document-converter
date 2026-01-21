import { z } from "zod";

type TemplateType<Schema> = {
  label: string;
  render: (dataDocument: z.infer<Schema>) => Promise<Blob>;
  schema: Schema;
  context?: string;
  filename: (dataDocument: z.infer<Schema>) => string;
  mock?: boolean | z.infer<Schema>;
};

export function defineTemplate<Schema>(
  template: TemplateType<Schema>
): TemplateType<Schema> {
  return template;
}
