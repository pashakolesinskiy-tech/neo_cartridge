"use client";

import { CircleHelp, MonitorSmartphone, ShieldAlert, TriangleAlert, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

/** Помощник подключения: ловит ситуацию «экран на localhost» и даёт чек-лист */
export default function ConnectionHelp({ code }: { code: string }) {
  const [urls, setUrls] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    const h = window.location.hostname;
    setIsLocal(h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "0.0.0.0");
    fetch("/api/server-info", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { urls?: string[] }) => setUrls(d.urls ?? []))
      .catch(() => setUrls([]));
  }, []);

  const best = urls[0];

  return (
    <div className="mt-4 space-y-3">
      {isLocal && best && (
        <div className="border-2 border-amber-400/80 bg-amber-950/40 p-4">
          <div className="flex items-center gap-2 font-pixel text-[9px] text-amber-300 blink-hard">
            <TriangleAlert className="h-4 w-4" />
            ТЕЛЕФОН НЕ СМОЖЕТ ЗАЙТИ НА LOCALHOST!
          </div>
          <p className="mt-2 font-term text-[11px] leading-snug text-slate-300">
            Экран открыт через <span className="text-rose-300">{window.location.hostname}</span>,
            а это «сам на себя». Открой экран через локальный IP — QR обновится сам:
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {urls.slice(0, 3).map((u) => (
              <a
                key={u}
                href={`${u}/ship/${code}`}
                className="pxl-btn inline-flex items-center justify-center gap-2 bg-amber-400 px-4 py-3 font-pixel text-[10px] text-black"
              >
                <MonitorSmartphone className="h-4 w-4" />
                ОТКРЫТЬ ЧЕРЕЗ {u.replace(/^https?:\/\//, "")}
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 font-term text-[11px] text-slate-500 hover:text-cyan-300"
      >
        <CircleHelp className="h-3.5 w-3.5" />
        {open ? "Скрыть помощь по подключению" : "QR не сканируется / телефон не заходит?"}
      </button>

      {open && (
        <div className="border border-slate-800 bg-[#070d18]/90 p-4 text-left">
          <div className="space-y-2 font-term text-[11px] leading-snug text-slate-400">
            <p className="flex gap-2">
              <Wifi className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              Телефон и компьютер — в <b className="text-slate-200">одной сети</b> (не “гостевой”,
              без изоляции клиентов в роутере, VPN выключен и там, и там).
            </p>
            <p className="flex gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              Файрвол пропускает порт <b className="text-slate-200">3000</b>. На Windows: брандмауэр
              → входящие правила → разрешить node.exe / порт 3000.
            </p>
            <p className="flex gap-2">
              <MonitorSmartphone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              Быстрый тест связи: открой на телефоне{" "}
              <b className="break-all text-slate-200">
                {best ? `${best}/api/health` : "http://IP-КОМПА:3000/api/health"}
              </b>{" "}
              — должно показать {"{\"ok\":true}"}.
            </p>
            <p>
              Ручной вход без QR: на телефоне открой{" "}
              <b className="break-all text-slate-200">{best ?? "http://IP-КОМПА:3000"}</b> и введи
              код комнаты{" "}
              <b className="font-pixel text-[10px] text-amber-300">{code}</b> на главной странице.
            </p>
            {urls.length > 0 && (
              <p className="text-slate-500">
                Сервер видит себя так: {urls.join(" · ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
