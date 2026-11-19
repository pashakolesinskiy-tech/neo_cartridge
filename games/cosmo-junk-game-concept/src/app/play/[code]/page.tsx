import PhoneClient from "@/components/phone/PhoneClient";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PhoneClient code={code.toUpperCase()} />;
}
