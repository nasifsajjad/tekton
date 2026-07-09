import { getContent } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";
import AdminEditor from "./AdminEditor";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Tekton — Site Editor",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    return <LoginForm />;
  }
  const content = await getContent();
  return <AdminEditor initialContent={content} />;
}
