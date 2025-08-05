import { StrictMode } from "react";
import { ThemeProvider } from "next-themes";
import { createRoot } from "react-dom/client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import routes from "./Routes";
import { Web3Provider } from "./Web3ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Web3Provider>
            <RouterProvider router={routes} />
          </Web3Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>
);
