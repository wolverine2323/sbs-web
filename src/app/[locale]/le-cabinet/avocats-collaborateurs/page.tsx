import { TeamPage } from "@/components/team/TeamPage";
import { sectionMetadata } from "@/sanity/lib/sections";

// Les avocats collaborateurs: tarjetas con foto, cargo e idiomas.

export const generateMetadata = () => sectionMetadata("associates");

export default function AssociatesPage() {
  return <TeamPage kind="associate" />;
}
