import { ZodError } from "zod";

export const parseZodError = (error: unknown): string => {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => {
      const path = issue.path.join(".");
      const message = issue.message;
      const code = issue.code;
      
      return `'${path}' error message: ${message} (${code})`;
    }).join(', ');
  }

  return "Unknown error";
}
