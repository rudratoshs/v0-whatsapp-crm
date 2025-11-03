import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function createTestUsers() {
  const testUsers = [
    {
      email: "admin@whatsapp-crm.com",
      password: "Admin@123456",
      fullName: "Admin User",
      role: "super_admin",
    },
    {
      email: "business@whatsapp-crm.com",
      password: "Business@123456",
      fullName: "Business Owner",
      role: "user",
    },
    {
      email: "agent@whatsapp-crm.com",
      password: "Agent@123456",
      fullName: "Support Agent",
      role: "agent",
    },
  ]

  try {
    // Get or create demo tenant
    const { data: existingTenant } = await supabaseAdmin.from("tenants").select("id").eq("slug", "demo").single()

    let tenantId = existingTenant?.id

    if (!tenantId) {
      const { data: newTenant } = await supabaseAdmin
        .from("tenants")
        .insert({
          name: "Demo Tenant",
          slug: "demo",
          description: "Demonstration tenant for testing",
          show_powered_by: true,
        })
        .select()
        .single()

      tenantId = newTenant?.id
    }

    // Create test users
    for (const testUser of testUsers) {
      try {
        // Create auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
        })

        if (authError) {
          console.log(`User ${testUser.email} might already exist:`, authError.message)
          continue
        }

        // Create user profile
        const { error: profileError } = await supabaseAdmin.from("users").insert({
          id: authUser.user.id,
          tenant_id: tenantId,
          email: testUser.email,
          full_name: testUser.fullName,
          role: testUser.role,
          status: "active",
        })

        if (profileError) {
          console.error(`Failed to create profile for ${testUser.email}:`, profileError)
        } else {
          console.log(`Created user: ${testUser.email}`)
        }
      } catch (error) {
        console.error(`Error creating user ${testUser.email}:`, error)
      }
    }

    console.log("Test users creation completed!")
  } catch (error) {
    console.error("Error:", error)
  }
}

createTestUsers()
