import rawCertificates from "@/content/certificates.json";
import { certificatesFileSchema } from "@/lib/certificates";

export const certificates = certificatesFileSchema.parse(rawCertificates);
export const visibleCertificates = certificates.filter((certificate) => certificate.visible);
