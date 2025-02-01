const logoUrl =
  'https://jgtkeyfxjkjzumehdhpo.supabase.co/storage/v1/object/sign/navindo/Logo%20Navindo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJuYXZpbmRvL0xvZ28gTmF2aW5kby5wbmciLCJpYXQiOjE3Mzg0MzE2NjgsImV4cCI6MTc2OTk2NzY2OH0.eUILCJAehY_VJ02gMN07_EtURSomfUtnUgd5mvcDAdE'

export const generateEmailTemplate = ({
  title,
  message,
  buttonText,
  buttonLink,
}: {
  title: string
  message: string
  buttonText: string
  buttonLink: string
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
        }
        .header img {
          max-width: 150px;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content h1 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          color: #666666;
          font-size: 16px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-size: 16px;
        }
        .footer {
          margin-top: 30px;
          padding: 20px;
          background-color: #f4f4f4;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          color: #666666;
        }
        .footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Navindo Logo">
        </div>
        <div class="content">
          <h1>${title}</h1>
          <p>${message}</p>
          <a href="${buttonLink}" class="button">${buttonText}</a>
          <p>If you did not create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p><strong>PT Navindo Maritim Indonesia</strong></p>
          <p>Exclusive Commercial Radin Inten Kav. 18, Jl. Radin Inten II No. 80, Duren Sawit, Jakarta Timur 13440</p>
          <p>Telephone: 021-38859032 | WhatsApp/Mobile: +62 813-9933-0084</p>
        </div>
      </div>
    </body>
    </html>
  `
}
