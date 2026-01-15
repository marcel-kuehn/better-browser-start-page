import { useAppConfig } from "@/contexts/AppConfig/useAppConfig";
import DefaultLayout from "../layouts/DefaultLayout";
import BlockRenderer from "../shared/BlockRenderer";
import Navigation from "../shared/Navigation";

export default function DefaultView() {
  const { config } = useAppConfig();

  return (
    <DefaultLayout>
      <Navigation />
      <main className="w-full max-w-7xl">
        <div className="flex flex-col gap-4">
          <BlockRenderer blocks={config.elements} />
        </div>
      </main>
    </DefaultLayout>
  );
}
