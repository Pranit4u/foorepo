import { CodeiumEditor } from "@codeium/react-code-editor";
import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Link } from "react-router-dom";

export const IdeWithAutocomplete = () => {
  const { theme } = useTheme();
  const [isDarkOn, setIsDarkOn] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("python");

  useEffect(() => {
    if (theme === "dark") {
      setIsDarkOn(true);
    } else if (theme === "light") {
      setIsDarkOn(false);
    } else {
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkOn(darkThemeMq.matches);
    }
  }, [theme]);

  return (
    <div className="h-full flex flex-col gap-2" style={{ backgroundColor: `${isDarkOn ? "#1e1e1e" : ""}` }}>
      <Breadcrumb className="hidden md:flex p-2 bg-background">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="#">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="#">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>All Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CodeiumEditor height={"100%"} language={currentLanguage} theme={`${isDarkOn ? "vs-dark" : "vs-light"}`} />
    </div>
  );
};