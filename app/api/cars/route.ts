import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const cars = await prisma.car.findMany({ orderBy: { registrationNumber: "asc" } });
    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Database error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await request.json();
    const created = await prisma.car.create({
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
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json(
      { error: "Database error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

