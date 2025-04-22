import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import "@buttery/studio-tokens/root.css";
import type { LinksFunction } from "react-router";
import { css } from "@linaria/core";
import { makeFontFamily } from "@buttery/studio-tokens";

import { LayoutHeader } from "./components/LayoutHeader";
import { LayoutHeaderLogo } from "./components/LayoutHeaderLogo";
import { LayoutMain } from "./components/LayoutMain";
import { LayoutFooter } from "./components/LayoutFooter";
import { Label } from "./components/Label";
import { getIsLocalConfig } from "./utils/util.getLocalConfig";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Mulish:wght@100..900",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000",
  },
  {
    rel: "stylesheet",
    href: "/font/consolas.css",
  },
];

const styles = css`
  :global() {
    html,
    body {
      margin: 0;
      padding: 0;
    }

    * {
      box-sizing: border-box;
      font-family: ${makeFontFamily("Mulish")};

      &::after,
      &::before {
        box-sizing: border-box;
      }
    }
  }
`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={styles}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader() {
  const isLocalConfig = getIsLocalConfig();
  if (isLocalConfig) {
    return { isLocal: true };
  }
  return { isLocal: false };
}

export default function App() {
  const { isLocal } = useLoaderData<typeof loader>();
  return (
    <>
      <LayoutHeader>
        <LayoutHeaderLogo
          dxSrc="/images/buttery-logo-tokens.png"
          dxAlt="buttery-tokens-logo"
          dxLabel={
            isLocal && (
              <div>
                <Label dxSize="dense" dxColor="primary">
                  LOCAL MODE
                </Label>
              </div>
            )
          }
        >
          Buttery Tokens
        </LayoutHeaderLogo>
        <div />
        {/* <LayoutHeaderMenu /> */}
      </LayoutHeader>
      <LayoutMain>
        <Outlet />
      </LayoutMain>
      <LayoutFooter>footer</LayoutFooter>
    </>
  );
  return;
}
