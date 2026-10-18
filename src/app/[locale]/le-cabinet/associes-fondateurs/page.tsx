import { TeamPage } from "@/components/team/TeamPage";
import { sectionMetadata } from "@/sanity/lib/sections";

// Les associés fondateurs: perfil completo de cada socio.

export const generateMetadata = () => sectionMetadata("founders");

export default function FoundersPage() {
  return <TeamPage kind="founder" />;
}
