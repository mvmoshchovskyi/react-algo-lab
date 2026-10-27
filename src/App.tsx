import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { TestResultsProvider } from "./components/TestResultsContext";
import { ExercisePage } from "./pages/ExercisePage";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <TestResultsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="exercise/:id" element={<ExercisePage />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </TestResultsProvider>
    </BrowserRouter>
  );
}
