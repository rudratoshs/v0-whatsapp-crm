import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId")
    const days = searchParams.get("days") || "30"

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId required" }, { status: 400 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(days))

    const { data, error } = await supabase
      .from("analytics_daily")
      .select("*")
      .eq("tenant_id", tenantId)
      .gte("date", startDate.toISOString().split("T")[0])
      .order("date", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
