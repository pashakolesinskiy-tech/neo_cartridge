import { createRoot } from "react-dom/client";
import LandingClient from "@/components/landing/LandingClient";
import ShipScreen from "@/components/screen/ShipScreen";
import PhoneClient from "@/components/phone/PhoneClient";
import HomeLeaderboard from "./HomeLeaderboard";

// Точки входа: /  → лобби+зал славы, /ship/CODE → большой экран, /play/CODE → пульт.
const seg = window.location.pathname.split("/").filter(Boolean).map((s) => decodeURIComponent(s));
const route = (seg[0] ?? "").toLowerCase();
const code = (seg[1] ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12) || "0000";

const root = document.getElementById("root")!;
const mount = createRoot(root);

if (route === "ship") {
  mount.render(<ShipScreen code={code} />);
} else if (route === "play") {
  mount.render(<PhoneClient code={code} />);
} else {
  mount.render(
    <>
      <LandingClient />
      <HomeLeaderboard />
    </>
  );
}
