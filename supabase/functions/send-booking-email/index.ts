import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { customerEmail, customerName, status, vehicleName, pickupDate, returnDate, totalPrice } = await req.json()

    console.log(`[send-booking-email] Sending ${status} email to ${customerEmail}`)

    // NOTE: You should set up an email provider like Resend, SendGrid, or Postmark here.
    // For now, we log the action. To fully implement, you would use:
    // const res = await fetch('https://api.resend.com/emails', { ... })

    const subject = status === 'approved' 
      ? `Booking Approved: ${vehicleName} - PalExpress`
      : `Booking Update: ${vehicleName} - PalExpress`;

    const message = status === 'approved'
      ? `Hi ${customerName},\n\nYour booking for the ${vehicleName} from ${pickupDate} to ${returnDate} has been APPROVED! We look forward to seeing you.\n\nTotal: ₱${totalPrice.toLocaleString()}`
      : `Hi ${customerName},\n\nThank you for your interest. Unfortunately, your booking request for the ${vehicleName} has been declined at this time. Please feel free to check other available dates.`;

    // This is where the actual email sending logic would go.
    // Example with a generic fetch (placeholder):
    /*
    await fetch('https://api.your-email-provider.com/send', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer YOUR_API_KEY', 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: customerEmail, subject, text: message })
    })
    */

    return new Response(JSON.stringify({ success: true, message: `Email logic triggered for ${status}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[send-booking-email] Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})