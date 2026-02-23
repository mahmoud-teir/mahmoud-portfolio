/**
 * Neo-Brutalist HTML Email Templates 
 * aesthetic: high-contrast, bold borders, neon accents
 */

export const recoveryEmailTemplate = (url: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: 'Courier New', Courier, monospace;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      border: 4px solid #000000;
      background-color: #ffffff;
      padding: 40px;
      box-shadow: 16px 16px 0px 0px #000000;
    }
    .header {
      background-color: #000000;
      color: #adff2f;
      padding: 10px 20px;
      display: inline-block;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 30px;
    }
    .title {
      font-size: 48px;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 1;
      margin-bottom: 20px;
    }
    .description {
      font-size: 18px;
      font-weight: bold;
      text-transform: uppercase;
      border-left: 8px solid #000000;
      padding-left: 20px;
      margin-bottom: 40px;
    }
    .button-container {
      margin-top: 40px;
      margin-bottom: 40px;
    }
    .button {
      background-color: #adff2f;
      color: #000000;
      border: 4px solid #000000;
      padding: 20px 40px;
      text-decoration: none;
      font-size: 24px;
      font-weight: 900;
      text-transform: uppercase;
      display: inline-block;
      box-shadow: 8px 8px 0px 0px #000000;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 4px solid #000000;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Protocol_Initiated</div>
    <div class="title">RECOVERY_PROTOCOL</div>
    <div class="description">Secure uplink established. Proceed to restore system access.</div>
    
    <div class="button-container">
      <a href="${url}" class="button">RESTORE_ACCESS</a>
    </div>
    
    <p style="font-size: 12px; color: #666;">If you didn't request this, ignore this transmission. This link expires shortly.</p>
    
    <div class="footer">
      MAHMOUD.DEV_OS // V2.0.4_BUILD // SECURE_TRANSMISSION
    </div>
  </div>
</body>
</html>
`;

export const contactEmailTemplate = (name: string, email: string, message: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: 'Courier New', Courier, monospace;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      border: 4px solid #000000;
      background-color: #ffffff;
      padding: 40px;
      box-shadow: 16px 16px 0px 0px #000000;
    }
    .header {
      background-color: #000000;
      color: #adff2f;
      padding: 10px 20px;
      display: inline-block;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 30px;
    }
    .title {
      font-size: 40px;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 1;
      margin-bottom: 20px;
    }
    .info-grid {
      border: 4px solid #000000;
      margin-bottom: 30px;
    }
    .info-row {
      border-bottom: 4px solid #000000;
      padding: 15px;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 900;
      text-transform: uppercase;
      font-size: 12px;
      display: block;
      margin-bottom: 5px;
    }
    .value {
      font-size: 18px;
      font-weight: bold;
    }
    .payload {
      background-color: #f0f0f0;
      border: 4px solid #000000;
      padding: 20px;
      font-size: 16px;
      white-space: pre-wrap;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 4px solid #000000;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Inbound_Transmission</div>
    <div class="title">NEW_CONTACT_MESSAGE</div>
    
    <div class="info-grid">
      <div class="info-row">
        <span class="label">SENDER_IDENTITY</span>
        <span class="value">${name}</span>
      </div>
      <div class="info-row">
        <span class="label">SIGNAL_SOURCE</span>
        <span class="value">${email}</span>
      </div>
    </div>
    
    <div class="label" style="margin-bottom: 10px;">MESSAGE_PAYLOAD</div>
    <div class="payload">${message}</div>
    
    <div class="footer">
      MAHMOUD.DEV_OS // CONTACT_PROTOCOL // SECURE_HUB
    </div>
  </div>
</body>
</html>
`;
