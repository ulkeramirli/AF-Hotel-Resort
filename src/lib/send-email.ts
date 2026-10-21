import { transporter } from "./mail";

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    // Extract OTP from HTML if possible (look for large numbers)
    const otpMatch = html.match(/\b(\d{6})\b/);
    const otp = otpMatch ? otpMatch[1] : "See HTML below";

    console.log("\n\n");
    console.log("╔══════════════════════════════════════════════════════╗");
    console.log("║           📧  MOCK EMAIL (No SMTP configured)        ║");
    console.log("╠══════════════════════════════════════════════════════╣");
    console.log(`║  TO:      ${to.padEnd(43)}║`);
    console.log(`║  SUBJECT: ${subject.substring(0, 43).padEnd(43)}║`);
    console.log(`║  OTP CODE: ${String(otp).padEnd(42)}║`);
    console.log("╚══════════════════════════════════════════════════════╝");
    console.log("\n⚠️  Add MAIL_USER and MAIL_PASSWORD to .env to send real emails\n");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"AF Hotel & Aqua Park" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error: any) {
    console.error("❌ Email göndərilərkən xəta baş verdi:", error.message);
    
    // Fallback to console in development so the developer isn't blocked
    if (process.env.NODE_ENV === "development") {
      const otpMatch = html.match(/\b(\d{6})\b/);
      const otp = otpMatch ? otpMatch[1] : "N/A";
      console.log("\n\n");
      console.log("╔══════════════════════════════════════════════════════╗");
      console.log("║    ⚠️ MOCK EMAIL (SMTP AUTH FAILED - Check .env)     ║");
      console.log("╠══════════════════════════════════════════════════════╣");
      console.log(`║  TO:      ${to.padEnd(43)}║`);
      console.log(`║  OTP CODE: ${String(otp).padEnd(42)}║`);
      console.log("╚══════════════════════════════════════════════════════╝\n");
      // Don't throw, let the flow continue so they can use the OTP from terminal
    } else {
      throw error;
    }
  }


}
