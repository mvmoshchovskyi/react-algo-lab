import { createContext, useContext, useState, type ReactNode } from "react";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs.* must be used inside <Tabs>");
  return context;
}

function TabsRoot({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children }: { children: ReactNode }) {
  return (
    <div className="tabs-list" role="tablist" aria-label="Розділи задачі">
      {children}
    </div>
  );
}

function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const context = useTabsContext();
  const active = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`tabs-trigger ${active ? "is-active" : ""}`}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}

function TabsPanel({ value, children }: { value: string; children: ReactNode }) {
  const context = useTabsContext();
  if (context.value !== value) return null;
  return (
    <div className="tabs-panel" role="tabpanel">
      {children}
    </div>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
});
