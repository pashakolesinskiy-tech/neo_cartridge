import ShipScreen from "@/components/screen/ShipScreen";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <ShipScreen code={code.toUpperCase()} />;
}
