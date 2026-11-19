import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import LandingClient from "@/components/landing/LandingClient";
import ShipScreen from "@/components/screen/ShipScreen";
import PhoneClient from "@/components/phone/PhoneClient";
import HomeLeaderboard from "./HomeLeaderboard";

function readRoute(): { route: string; code: string } {
  const rawPath = window.location.hash.startsWith("#/")
    ? window.location.hash.slice(1).split("?")[0]
    : window.location.pathname;
  const seg = rawPath
    .split("/")
    .filter(Boolean)
    .map((s) => decodeURIComponent(s));
  const route = (seg[0] ?? "").toLowerCase();
  const code =
    (seg[1] ?? "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 12) || "0000";
  return { route, code };
}

function AppRouter() {
  const [loc, setLoc] = useState(readRoute);

  useEffect(() => {
    const sync = () => {
      const next = readRoute();
      setLoc(next);
      window.dispatchEvent(new CustomEvent("cosmo:route", { detail: next }));
    };
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    sync();
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  if (loc.route === "ship") {
    return <ShipScreen key={`ship-${loc.code}`} code={loc.code} />;
  }
  if (loc.route === "play") {
    return <PhoneClient key={`play-${loc.code}`} code={loc.code} />;
  }
  return (
    <>
      <LandingClient />
      <HomeLeaderboard />
    </>
  );
}

const root = document.getElementById("root")!;
const mount = createRoot(root);
mount.render(<AppRouter />);
