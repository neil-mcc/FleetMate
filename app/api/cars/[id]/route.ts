import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const car = await prisma.car.findUnique({ where: { id: Number(params.id) } });
    if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { error: "Database error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await request.json();
    const updated = await prisma.car.update({
      where: { id: Number(params.id) },
      data: {
        registrationNumber: data.registrationNumber,
        make: data.make,
        model: data.model,
        year: Number(data.year),
        lastServiceDate: data.lastServiceDate ? new Date(data.lastServiceDate) : null,
        nextServiceDue: data.nextServiceDue ? new Date(data.nextServiceDue) : null,
        motDueDate: data.motDueDate ? new Date(data.motDueDate) : null,
        insuranceRenewal: data.insuranceRenewal ? new Date(data.insuranceRenewal) : null,
        taxRenewal: data.taxRenewal ? new Date(data.taxRenewal) : null
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Database error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await prisma.car.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { error: "Database error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

