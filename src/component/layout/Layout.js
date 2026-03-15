import { Providers } from "@/Provider";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const RootLayout = ({ children }) => {
  return (
    <Providers>
      <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
        <div className="mainSidebar">
          <Sidebar />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <main className="mainAdmin">{children}</main>
        </div>
      </div>
    </Providers>
  );
};

export default RootLayout;
