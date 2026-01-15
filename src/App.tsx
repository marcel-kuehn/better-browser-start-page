import DefaultView from "./components/views/DefaultView";
import { AppConfigProvider } from "./contexts/AppConfig/provider";

function App() {
  return (
    <AppConfigProvider>
      <DefaultView />
    </AppConfigProvider>
  );
}

export default App;
