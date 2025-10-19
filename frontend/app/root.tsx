import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { AppBar } from "./components/AppBar";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    typography: {
      fontFamily: '"Montserrat", roboto, ui-sans-serif, system-ui, sans-serif',
    },
    palette: {
      mode: "light",
      primary: {
        main: "#ff096c",
      },
      secondary: {
        main: "#f4f6fc",
      },
      background: {
        default: "#192731",
        paper: "#192731",
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: "#f4f6fc", // texto digitado
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f4f6fc", // borda padrão
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f4f6fc !important", // força branco no hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f4f6fc", // borda focada
            },
            "& input": {
              color: "#f4f6fc",
            },
            "& svg": {
              color: "#f4f6fc", // ícones internos (ex: adornments)
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#f4f6fc",
            "&.Mui-focused": {
              color: "#f4f6fc",
            },
          },
        },
      },
    },
  });
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <main>
            <AppBar />
            {children}
          </main>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
