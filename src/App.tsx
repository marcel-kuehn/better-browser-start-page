import { AppsWidget } from "./components/custom/AppsWidget";
import { LinksWidget } from "./components/custom/LinksWidget";
import { SearchWidget } from "./components/custom/SearchWidget";
import View from "./components/custom/View";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AppsProvider } from "./context/apps";
import { LinksProvider } from "./context/links";
import { SearchProvider } from "./context/search";

function App() {
  return (
    <ThemeProvider>
      <View>
        <main className="w-full max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <SearchProvider>
              <SearchWidget />
            </SearchProvider>
            <AppsProvider>
              <AppsWidget />
            </AppsProvider>
            <LinksProvider>
              <LinksWidget />
            </LinksProvider>
          </div>
        </main>
      </View>
    </ThemeProvider>
  );
}

export default App;
