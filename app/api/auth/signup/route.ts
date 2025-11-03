import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  const { email, password, full_name, tenant_id } = await request.json()

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) throw authError

    // Create user record in database
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        id: authData.user.id,
        email,
        full_name,
        tenant_id,
        role: "user",
        status: "active",
      })
      .select()
      .single()

    if (error) throw error

    // Get or create subscription
    const { data: plans } = await supabaseAdmin.from("subscription_plans").select("id").eq("name", "Starter").single()

    if (plans) {
      await supabaseAdmin.from("subscriptions").insert({
        user_id: authData.user.id,
        plan_id: plans.id,
        status: "trial",
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    return NextResponse.json({ user: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
