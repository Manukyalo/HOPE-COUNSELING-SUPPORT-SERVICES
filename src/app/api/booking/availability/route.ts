import { NextRequest, NextResponse } from "next/server";
import { getDaySlots, getMonthAvailability } from "@/lib/booking-engine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // e.g. "2026-10"
    const date = searchParams.get("date");   // e.g. "2026-10-15"

    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json(
          { error: "Invalid date format. Expected YYYY-MM-DD", code: "BAD_REQUEST" },
          { status: 400 }
        );
      }
      const slots = await getDaySlots(date);
      return NextResponse.json({ success: true, date, slots });
    }

    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return NextResponse.json(
          { error: "Invalid month format. Expected YYYY-MM", code: "BAD_REQUEST" },
          { status: 400 }
        );
      }
      const { availability, isConfigured } = await getMonthAvailability(month);
      return NextResponse.json({ success: true, month, availability, isConfigured });
    }

    // Default: return current and next month availability
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, "0")}`;

    const [currentMonthData, nextMonthData] = await Promise.all([
      getMonthAvailability(currentMonth),
      getMonthAvailability(nextMonth),
    ]);

    return NextResponse.json({
      success: true,
      isConfigured: currentMonthData.isConfigured || nextMonthData.isConfigured,
      months: {
        [currentMonth]: currentMonthData.availability,
        [nextMonth]: nextMonthData.availability,
      },
    });
  } catch (err: unknown) {
    const error = err as Error & { code?: string };
    console.error("[api/booking/availability] Server error during availability calculation:", {
      name: error?.name || "Error",
      message: error?.message || "Unknown error",
      code: error?.code || "INTERNAL_ERROR",
      stack: error?.stack,
    });
    return NextResponse.json(
      { error: "Failed to load availability", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

