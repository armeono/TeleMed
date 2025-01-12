import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailAfterAppointment = {
  doctorMail: string;
  patientMail: string;
  feedback: string;
};

export const action_sendEmailAfterAppointment = async ({
  doctorMail,
  patientMail,
  feedback,
}: SendEmailAfterAppointment) => {
  try {
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 700px;
            margin: 30px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
          }
          .header {
            background-color: #0073e6;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
          }
          .content {
            padding: 30px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #0073e6;
            margin-bottom: 10px;
            border-bottom: 2px solid #0073e6;
            padding-bottom: 5px;
          }
          .section-content {
            font-size: 16px;
            color: #555;
          }
          .section-content p {
            margin: 10px 0;
          }
          .footer {
            background-color: #f9f9f9;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #666;
          }
          .footer a {
            color: #0073e6;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            TeleMed - Appointment Report
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">Patient Information</div>
              <div class="section-content">
                <p><strong>Patient Email:</strong> ${patientMail}</p>
              </div>
            </div>
            <div class="section">
              <div class="section-title">Doctor's Information</div>
              <div class="section-content">
                <p><strong>Doctor Email:</strong> ${doctorMail}</p>
              </div>
            </div>
            <div class="section">
              <div class="section-title">Doctor's Feedback</div>
              <div class="section-content">
                <p>${feedback}</p>
              </div>
            </div>
            <div class="section">
              <div class="section-title">Additional Information</div>
              <div class="section-content">
                <p>If you have any questions regarding this report, please contact your doctor directly or reach out to TeleMed support for assistance.</p>
              </div>
            </div>
          </div>
         <div class="footer">
          <p>Thank you for using TeleMed. For more information, visit <a href="https://telemed.com">our website</a>.</p>
          <img src="https://uverbfnoyutuywypfscl.supabase.co/storage/v1/object/public/Footer/footer.png" alt="Footer Image">
        </div>
        </div>
      </body>
      </html>
    `;

    const response = await resend.emails.send({
      from: "info@armeono.com",
      to: patientMail,
      subject: "Appointment Feedback",
      html: emailTemplate,
    });

    return {
      status: "success",
      message: "Email sent successfully!",
    };
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      message: "Failed to send email after appointment!",
    };
  }
};
