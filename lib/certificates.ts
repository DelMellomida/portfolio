import { z } from "zod";

export const CERTIFICATES_PATH = "content/certificates.json";
export const CERTIFICATES_DIR = "public/certificates";

export const certificateSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Certificate id is required")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(1, "Title is required").max(120),
  issuer: z.string().trim().min(1, "Issuer is required").max(100),
  issuedAt: z.string().trim().min(1, "Issue date is required").max(40),
  file: z
    .string()
    .trim()
    .regex(/^\/certificates\/[^/]+\.pdf$/i, "Choose a PDF under /certificates"),
  tags: z.array(z.string().trim().min(1, "Tag cannot be blank").max(40)).max(8).default([]),
  visible: z.boolean().default(true),
});

export const certificatesFileSchema = z
  .array(certificateSchema)
  .superRefine((certificates, ctx) => {
    const seen = new Set<string>();
    certificates.forEach((certificate, index) => {
      if (seen.has(certificate.id)) {
        ctx.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `Duplicate certificate id "${certificate.id}"`,
        });
      }
      seen.add(certificate.id);
    });
  });

export type Certificate = z.infer<typeof certificateSchema>;

export function parseCertificates(raw: string): Certificate[] {
  const json: unknown = JSON.parse(raw.replace(/^\uFEFF/, ""));
  return certificatesFileSchema.parse(json);
}

export function serializeCertificates(certificates: Certificate[]): string {
  return `${JSON.stringify(certificates, null, 2)}\n`;
}

export function formatCertificateIssues(error: z.ZodError): string {
  return error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
}
