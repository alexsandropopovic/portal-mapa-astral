import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { html, name } = await req.json();

    if (!html || !name) {
      return NextResponse.json({ error: "HTML e nome são obrigatórios." }, { status: 400 });
    }

    const pdfShiftApiKey = process.env.PDFSHIFT_API_KEY;
    if (!pdfShiftApiKey) {
      return NextResponse.json({ error: "PDFSHIFT_API_KEY não configurada na Vercel." }, { status: 500 });
    }

    const pdfResponse = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`api:${pdfShiftApiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: html,
        format: "A4",
        margin: "0px",
      }),
    });

    if (!pdfResponse.ok) {
      const pdfError = await pdfResponse.text();
      throw new Error(`Erro PDFShift: ${pdfError}`);
    }

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Guia-Autoconhecimento-${encodeURIComponent(name)}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Erro ao exportar PDF:", error);
    return NextResponse.json({ error: error.message || "Erro ao gerar PDF" }, { status: 500 });
  }
}