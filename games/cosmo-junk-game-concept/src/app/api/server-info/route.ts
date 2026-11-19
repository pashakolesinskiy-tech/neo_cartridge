import os from "os";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Возвращает адреса, по которым сервер доступен из локальной сети */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const port = url.port || (url.protocol === "https:" ? "443" : "80");
  const proto = url.protocol.replace(":", "");

  const nets = os.networkInterfaces();
  const ips: string[] = [];
  for (const list of Object.values(nets)) {
    for (const net of list ?? []) {
      if (String(net.family) === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  // домашние подсети первыми — они нужны чаще всего
  const prio = (ip: string) =>
    ip.startsWith("192.168.") ? 0 : ip.startsWith("10.") ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ? 2 : 3;
  ips.sort((a, b) => prio(a) - prio(b));

  const suffix = port === "80" || port === "443" ? "" : `:${port}`;
  return Response.json({
    urls: ips.map((ip) => `${proto}://${ip}${suffix}`),
  });
}
