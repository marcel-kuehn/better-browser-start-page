import View from "./components/layouts/DefaultLayout";
import BlockRenderer from "./components/shared/BlockRenderer";
import Navigation from "./components/shared/Navigation";
import { ThemeProvider } from "./components/ui/theme-provider";
import { loadConfig } from "./lib/config";
import { isLatestConfigVersion } from "./lib/migration";

function App() {
  const appConfig = loadConfig("local");

  const version = (appConfig as { _v?: string })._v ?? "0.0.0";
  const needsMigration = !isLatestConfigVersion(version);

  const blocks = needsMigration
    ? [
        {
          type: "grid",
          elements: [
            {
              type: "migration-widget",
              gridArea: {
                rowStart: 1,
                rowEnd: 2,
                columnStart: 2,
                columnEnd: 4,
              },
              config: appConfig as unknown as Record<string, unknown>,
            },
          ],
        },
      ]
    : appConfig.elements;

  return (
    <ThemeProvider>
      <View>
        {!needsMigration && <Navigation />}
        <main className="w-full max-w-7xl">
          <div className="flex flex-col gap-4">
            <BlockRenderer blocks={blocks} />
          </div>
        </main>
      </View>
    </ThemeProvider>
  );
}

export default App;
