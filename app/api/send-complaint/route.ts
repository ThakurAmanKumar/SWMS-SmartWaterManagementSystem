import { NextResponse } from "next/server"

function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64")
}

function generateEmailHTML(complaint: {
  fullName: string
  address: string
  contactNo: string
  userId: string
  ward: string
  complaintType: string
  details: string
  submittedAt: string
}) {
  const year = new Date().getFullYear()
  // Use absolute URL to public asset so Resend can fetch and display it
  const logoImg = `<img src="https://raw.githubusercontent.com/ThakurAmanKumar/webIMG/refs/heads/main/img%20for%20site/swms.jpg" alt="SWMS Logo" style="max-width:140px;height:auto;display:block;margin:0 auto 12px;" onerror="this.style.display='none'" />`

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: system-ui, -apple-system, Roboto, 'Segoe UI', Arial; background: #f8fafc; margin:0; padding:20px; }
      .card { max-width:700px; margin:0 auto; background:#fff; border-radius:12px; box-shadow:0 8px 30px rgba(2,6,23,0.08); overflow:hidden }
      .header { background: linear-gradient(90deg,#06b6d4,#3b82f6); padding:28px; text-align:center; color:#fff }
      .content { padding:24px; color:#0f172a }
      .table { width:100%; border-collapse:collapse; margin-bottom:18px }
      .table td { padding:8px 6px; border-bottom:1px solid #e6f4fb }
      .label { color:#0369a1; font-weight:700; width:30% }
      .value { color:#0f172a }
      .details { white-space:pre-wrap; background:#f1f9ff; padding:12px; border-radius:8px; border:1px solid #e0f7ff }
      .image { margin-top:18px; text-align:center }
      .footer { background:#f1f5f9; padding:16px; text-align:center; color:#475569; font-size:13px }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        ${logoImg}
        <h2 style="margin:6px 0 0;font-size:20px;">New Complaint Received</h2>
        <div style="opacity:0.95; margin-top:6px;">Smart Water Management System (SWMS)</div>
      </div>
      <div class="content">
        <table class="table">
          <tr>
            <td class="label">Name</td>
            <td class="value"><strong>${complaint.fullName}</strong></td>
          </tr>
          <tr>
            <td class="label">User ID</td>
            <td class="value"><strong>${complaint.userId}</strong></td>
          </tr>
          <tr>
            <td class="label">Ward</td>
            <td class="value"><strong>${complaint.ward}</strong></td>
          </tr>
          <tr>
            <td class="label">Contact No.</td>
            <td class="value"><strong>${complaint.contactNo}</strong></td>
          </tr>
          <tr>
            <td class="label">Address</td>
            <td class="value"><strong>${complaint.address}</strong></td>
          </tr>
          <tr>
            <td class="label">Complaint Type</td>
            <td class="value"><strong>${complaint.complaintType}</strong></td>
          </tr>
          <tr>
            <td class="label">Complaint Details</td>
            <td class="value"><strong>${complaint.details}</strong></td>
          </tr>
          <tr>
            <td class="label">Attach Image</td>
            <td class="value"><strong>Attached</strong></td>
          </tr>
        </table>

        <div>
          <h4 style="margin:0 0 8px 0;color:#0369a1">Submitted At</h4>
          <div class="details">${complaint.submittedAt}</div>
        </div>

      </div>
      <div class="footer">
        📧 Complaints are sent directly to SWMS Helpdesk (swms.helpdesk@gmail.com)
        <div style="margin-top:8px; font-size:12px; color:#94a3b8">© ${year} Smart Water Management System (SWMS) — This email was auto-generated from the SWMS Complaint Portal.</div>
      </div>
    </div>
  </body>
</html>`
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const fullName = (formData.get("fullName") as string) || "Unknown"
    const address = (formData.get("address") as string) || "Unknown"
    const contactNo = (formData.get("contactNo") as string) || "Unknown"
    const userId = (formData.get("userId") as string) || "Unknown"
    const ward = (formData.get("ward") as string) || "Unknown"
    const complaintType = (formData.get("complaintType") as string) || "Other"
    const details = (formData.get("details") as string) || ""
    const imageFile = formData.get("image") as File | null

    if (!fullName || !ward || !complaintType || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const submittedAt = new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    })

    const html = generateEmailHTML({
      fullName,
      address,
      contactNo,
      userId,
      ward,
      complaintType,
      details,
      submittedAt,
    })

    // Prepare attachments array for Resend REST API (base64 encoded data)
    const attachmentsForApi: Array<any> = []

    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
      const imageBase64 = bufferToBase64(imageBuffer)
      const mimeType = (imageFile as any).type || "image/jpeg"
      attachmentsForApi.push({
        filename: imageFile.name || "complaint-image.jpg",
        content: imageBase64,
      })
    }

    // Use Resend REST API directly so we don't require the 'resend' package
    const resendApiKey = process.env.RESEND_API_KEY
    const payload: any = {
      from: "SWMS Helpdesk <onboarding@resend.dev>",
      to: ["swms.helpdesk@gmail.com"],
      subject: `New Complaint from Ward no. ${ward} - ${complaintType}`,
      html,
    }

    if (attachmentsForApi.length > 0) {
      payload.attachments = attachmentsForApi
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const respBody = await resp.json().catch(() => null)

    if (!resp.ok) {
      console.error("Resend API error:", resp.status, respBody)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log("Resend response:", respBody)

    return NextResponse.json({ success: true, id: respBody?.id || null })
  } catch (err) {
    console.error("send-complaint error:", err)
    return NextResponse.json({ error: "Failed to send complaint" }, { status: 500 })
  }
}
