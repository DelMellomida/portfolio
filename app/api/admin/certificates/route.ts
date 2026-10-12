import { NextResponse } from "next/server";
import { z } from "zod";
import {
  CERTIFICATES_DIR,
  CERTIFICATES_PATH,
  certificatesFileSchema,
  formatCertificateIssues,
  parseCertificates,
  serializeCertificates,
} from "@/lib/certificates";
import { GitHubError, getRemoteFile, listRemoteDirectory, writeRemoteFile } from "@/lib/github";

function handleError(error: unknown) {
  if (error instanceof GitHubError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Admin certificates route failed:", error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

function toPublicCertificatePath(path: string): string {
  return `/${path.replace(/^public\//, "").replace(/\\/g, "/")}`;
}

async function getAvailableCertificateFiles(): Promise<string[]> {
  const entries = await listRemoteDirectory(CERTIFICATES_DIR);
  return entries
    .filter((entry) => entry.type === "file" && entry.name.toLowerCase().endsWith(".pdf"))
    .map((entry) => toPublicCertificatePath(entry.path))
    .sort((a, b) => a.localeCompare(b));
}

export async function GET() {
  try {
    const [file, availableFiles] = await Promise.all([
      getRemoteFile(CERTIFICATES_PATH),
      getAvailableCertificateFiles(),
    ]);

    if (!file) {
      return NextResponse.json({ certificates: [], sha: null, availableFiles });
    }

    try {
      return NextResponse.json({
        certificates: parseCertificates(file.content),
        sha: file.sha,
        availableFiles,
      });
    } catch (error) {
      const message =
        error instanceof z.ZodError
          ? `${CERTIFICATES_PATH} is invalid:\n${formatCertificateIssues(error)}`
          : `${CERTIFICATES_PATH} is not valid JSON.`;
      return NextResponse.json({ error: message }, { status: 422 });
    }
  } catch (error) {
    return handleError(error);
  }
}

const putSchema = z.object({
  certificates: certificatesFileSchema,
  sha: z.string().nullable().optional(),
});

export async function PUT(req: Request) {
  try {
    const parsed = putSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Check the form and try again.",
          detail: formatCertificateIssues(parsed.error),
        },
        { status: 400 },
      );
    }

    const { certificates, sha } = parsed.data;
    const result = await writeRemoteFile({
      path: CERTIFICATES_PATH,
      content: serializeCertificates(certificates),
      message: `content: update certificates (${certificates.length} certificates)`,
      ...(sha ? { sha } : {}),
    });

    return NextResponse.json({ ok: true, commit: result.commit.html_url });
  } catch (error) {
    return handleError(error);
  }
}
