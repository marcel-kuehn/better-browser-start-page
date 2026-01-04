import View from "./components/layouts/DefaultLayout";
import BlockRenderer from "./components/shared/BlockRenderer";
import { ThemeProvider } from "./components/ui/theme-provider";
import { appConfig } from "./config";

function App() {
  return (
    <ThemeProvider>
      <View>
        <main className="w-full max-w-7xl">
          <div className="flex flex-col gap-4">
            <BlockRenderer
              blocks={[
                {
                  type: "grid",
                  elements: appConfig.widgets.filter((b) => !b.hidden),
                },
              ]}
            />
          </div>
        </main>
      </View>
    </ThemeProvider>
  );
}

export default App;
