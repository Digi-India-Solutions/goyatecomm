"use client";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "./redux/ReduxProvider";

export default function AppLayout({ children }) {
  
  return (
    <ReduxProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      {typeof children === "object" && !(children instanceof Error) ? (
        children
      ) : (
        <p style={{ color: "red" }}>
          Something went wrong while rendering this page.
        </p>
      )}
      <Footer />
    </ReduxProvider>
  );
}
