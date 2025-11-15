import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

interface ComplaintData {
  fullName: string
  ward: string
  complaintType: string
  details: string
  imageBuffer: Buffer
  imageName: string
  imageMimeType: string
}

// Function to convert Buffer to Base64
function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64")
}

// Function to generate HTML email template
function generateEmailHTML(complaint: Omit<ComplaintData, 'imageBuffer' | 'imageMimeType'> & { imageBase64?: string }): string {
  const currentYear = new Date().getFullYear()
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .logo-area {
      margin-bottom: 15px;
    }
    .logo-area img {
      max-width: 120px;
      height: auto;
    }
    .header h1 {
      margin: 10px 0 0 0;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .complaint-card {
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
      border: 1px solid #cffafe;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 30px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .detail-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .detail-label {
      font-size: 12px;
      font-weight: 600;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .detail-value {
      font-size: 15px;
      color: #1e293b;
      font-weight: 500;
    }
    .detail-row.full-width {
      grid-column: 1 / -1;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .details-table tr {
      border-bottom: 1px solid #e0f2fe;
    }
    .details-table td {
      padding: 12px 0;
      font-size: 14px;
    }
    .details-table td:first-child {
      font-weight: 600;
      color: #0369a1;
      width: 30%;
    }
    .details-table td:last-child {
      color: #334155;
    }
    .image-section {
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #e0f2fe;
    }
    .image-section h3 {
      margin: 0 0 15px 0;
      font-size: 14px;
      font-weight: 600;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .image-preview {
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid #bfdbfe;
      background: #f0f9ff;
      padding: 4px;
    }
    .image-preview img {
      max-width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
    }
    .footer-section {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 25px 30px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .footer-section p {
      margin: 5px 0;
    }
    .footer-copyright {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #cbd5e1;;
      color: #94a3b8;
      font-size: 11px;
    }
    .status-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header with Logo -->
    <div class="header">
      <div class="logo-area">
        <img src="https://raw.githubusercontent.com/yourusername/yourrepo/main/public/swms.png" alt="SWMS Logo" onerror="this.style.display='none'">
      </div>
      <h1>New Complaint Received</h1>
      <p>Smart Water Management System</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <div class="status-badge">Pending Review</div>
      
      <div class="complaint-card">
        <table class="details-table">
          <tr>
            <td>Name</td>
            <td><strong>${complaint.fullName}</strong></td>
          </tr>
          <tr>
            <td>Ward</td>
            <td><strong>${complaint.ward}</strong></td>
          </tr>
          <tr>
            <td>Complaint Type</td>
            <td><strong>${complaint.complaintType}</strong></td>
          </tr>
          <tr>
            <td>Submitted Date</td>
            <td><strong>${new Date().toLocaleString("en-IN", { 
              year: "numeric",
              month: "long", 
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Kolkata"
            })}</strong></td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0f2fe;">
          <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #0369a1; text-transform: uppercase;">Complaint Details</h3>
          <p style="margin: 0; color: #334155; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${complaint.details}</p>
        </div>

        ${complaint.imageBase64 ? `
        <div class="image-section">
          <h3>Attached Image</h3>
          <div class="image-preview">
            <img src="data:image/jpeg;base64,${complaint.imageBase64}" alt="Complaint Image">
          </div>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <p>📧 <strong>Action Required:</strong> Please review this complaint and respond within 24-48 hours.</p>
      <p style="color: #0369a1; margin-top: 10px;"><strong>SWMS Support Team</strong></p>
      <div class="footer-copyright">
        © ${currentYear} Smart Water Management System (SWMS)<br>
        This email was auto-generated from the SWMS Complaint Portal.<br>
        <a href="https://swms.gov.in" style="color: #0369a1; text-decoration: none;">Visit SWMS Portal</a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData()
    
    const fullName = formData.get("fullName") as string
    const ward = formData.get("ward") as string
    const complaintType = formData.get("complaintType") as string
    const details = formData.get("details") as string
    const imageFile = formData.get("image") as File

    // Validate required fields
    if (!fullName || !ward || !complaintType || !details) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
    const imageBase64 = bufferToBase64(imageBuffer)
    const imageMimeType = imageFile.type || "image/jpeg"

    // Prepare complaint data
    const complaintData: ComplaintData = {
      fullName,
      ward,
      complaintType,
      details,
      imageBuffer,
      imageName: imageFile.name,
      imageMimeType,
    }

    // Generate HTML email
    const htmlContent = generateEmailHTML({
      fullName: complaintData.fullName,
      ward: complaintData.ward,
      complaintType: complaintData.complaintType,
      details: complaintData.details,
      imageName: complaintData.imageName,
      imageBase64,
    })

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "SWMS Helpdesk <onboarding@resend.dev>",
      // Always send complaints to the SWMS helpdesk address
      to: "swms.helpdesk@gmail.com",
      subject: `New Complaint from ${ward} - ${complaintType}`,
      html: htmlContent,
      attachments: [
        {
          filename: imageFile.name,
          content: imageBuffer,
        },
      ],
    })

    // Check if email was sent successfully
    if (emailResponse.error) {
      console.error("Resend Error:", emailResponse.error)
      return NextResponse.json(
        { error: "Failed to send complaint email. Please try again." },
        { status: 500 }
      )
    }

    // Log complaint (optional - for record keeping)
    console.log("Complaint submitted successfully:", {
      email: emailResponse.id,
      complaint: {
        fullName,
        ward,
        complaintType,
        submittedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Complaint submitted successfully",
        emailId: emailResponse.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Complaint submission error:", error)

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred"

    return NextResponse.json(
      { error: `Failed to submit complaint: ${errorMessage}` },
      { status: 500 }
    )
  }
}
