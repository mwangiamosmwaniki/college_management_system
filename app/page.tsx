import PublicLandingPageView from "@/components/portals/public/PublicLandingPageView";
import { ERPProvider } from "@/context/erp-context";

export default function Page() {
  return (
    <ERPProvider>
      <PublicLandingPageView />
    </ERPProvider>
  );
}
