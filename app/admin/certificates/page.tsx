import { z } from "zod";
import { CertificatesEditor } from "@/components/admin/certificates-editor";
import {
  CERTIFICATES_DIR,
  CERTIFICATES_PATH,
  formatCertificateIssues,
  parseCertificates,
  type Certificate,
} from "@/lib/certificates";
import { GitHubError, getRemoteFile, listRemoteDirectory } from "@/lib/github";

export const dynamic = "force-dynamic";

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

export default async function AdminCertificatesPage() {
  let certificates: Certificate[] = [];
  let availableFiles: string[] = [];
  let sha: string | null = null;
  let error: string | null = null;

  try {
    const [file, files] = await Promise.all([
      getRemoteFile(CERTIFICATES_PATH),
      getAvailableCertificateFiles(),
    ]);
    availableFiles = files;

    if (file) {
      sha = file.sha;
      try {
        certificates = parseCertificates(file.content);
      } catch (parseError) {
        error =
          parseError instanceof z.ZodError
            ? `${CERTIFICATES_PATH} is invalid:\n${formatCertificateIssues(parseError)}`
            : `${CERTIFICATES_PATH} is not valid JSON.`;
      }
    }
  } catch (err) {
    error =
      err instanceof GitHubError
        ? err.message
        : "Couldn't reach GitHub. Check GITHUB_TOKEN and GITHUB_REPO.";
  }

  if (error) {
    return (
      <div className="border-danger/40 bg-danger/5 rounded-[--radius-card] border p-6">
        <p className="text-danger text-sm font-medium">Couldn&apos;t load certificates</p>
        <pre className="text-muted mt-2 font-mono text-xs whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  return (
    <CertificatesEditor
      initialCertificates={certificates}
      initialSha={sha}
      initialAvailableFiles={availableFiles}
    />
  );
}
