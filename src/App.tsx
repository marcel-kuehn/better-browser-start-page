import View from "./components/layouts/DefaultLayout";
import WidgetRenderer from "./components/shared/WidgetRenderer";
import { ThemeProvider } from "./components/ui/theme-provider";
import { appConfig } from "./config";

function App() {
  return (
    <ThemeProvider>
      <View>
        <main className="w-full max-w-7xl">
          <div className="flex flex-col gap-4">
            <WidgetRenderer widgets={appConfig.widgets} />
          </div>
        </main>
      </View>
    </ThemeProvider>
  );
}

export default App;
