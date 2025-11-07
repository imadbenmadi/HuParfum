// Email notification service
// Sends Arabic Darja emails for various order and account events

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Get Arabic status label
function getArabicStatusLabel(status) {
    const statusMap = {
        requested: "جديد",
        under_discussion: "قيد المناقشة",
        payed: "تمّ الدفع",
        delivering: "جاري التوصيل",
        delivered_successfully: "توصّل بنجاح",
    };
    return statusMap[status] || status;
}

// Send verification email
async function sendVerificationEmail(email, userName, verificationLink) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Confirm Your Account - HuParfum",
        html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h1 style="color: #d4af37; text-align: center; margin-bottom: 30px;">HuParfum</h1>
          <h2 style="color: #333; margin-bottom: 20px;">سلام يا ${userName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            مرحبا بيك في HuParfum! نحنا سعداء بك في عائلتنا الكريمة. 
            كاين طريقة واحدة باش نكملو: أكّد حسابك باش تقدر توضع طلبياتك.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Confirm Account
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            أو انسخ واحط هاد الرابط في المتصفح:
            <br>
            <span style="color: #666; word-break: break-all;">${verificationLink}</span>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            هاد الرابط صالح حتى غدا فقط. بعد ما تكملو، غادي تقدر توضع الطلبيات ديالك.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 HuParfum - الجزائر
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[OK] Verification email sent to ${email}`);
    } catch (err) {
        console.error(`[ERROR] Failed to send verification email to ${email}:`, err);
    }
}

// Send order confirmation email
async function sendOrderConfirmationEmail(
    email,
    userName,
    orderId,
    productName,
    quantity,
    price
) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Order #${orderId} Confirmed - HuParfum`,
        html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h1 style="color: #d4af37; text-align: center; margin-bottom: 30px;">HuParfum</h1>
          <h2 style="color: #333; margin-bottom: 20px;">يا سلام يا ${userName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            طلبياتك توصّلت بنجاح للنظام ديالنا! هدى التفاصيل:
          </p>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0; color: #666;">
              <strong>رقم الطلب:</strong> #${orderId}
            </p>
            <p style="margin: 10px 0; color: #666;">
              <strong>المنتوج:</strong> ${productName}
            </p>
            <p style="margin: 10px 0; color: #666;">
              <strong>الكمية:</strong> ${quantity}
            </p>
            <p style="margin: 10px 0; color: #d4af37; font-size: 18px;">
              <strong>السعر الكلي:</strong> ${price} دج
            </p>
          </div>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
            هدى الحالة ديالك هسع <strong>جديد</strong>. هدى ستتكلم معاك هاد التاني (فهاد الإيميل أو التيليجرام).
          </p>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #d4af37;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              Tip: Connect your account to our Telegram bot to get instant updates!
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 HuParfum - الجزائر
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[OK] Order confirmation email sent to ${email}`);
    } catch (err) {
        console.error(
            `[ERROR] Failed to send order confirmation email to ${email}:`,
            err
        );
    }
}

// Send payment confirmation email
async function sendPaymentConfirmationEmail(email, userName, orderId) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Payment Confirmation - Order #${orderId}`,
        html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h1 style="color: #d4af37; text-align: center; margin-bottom: 30px;">HuParfum</h1>
          <h2 style="color: #333; margin-bottom: 20px;">الله يبارك يا ${userName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            الدفع ديال الطلب #${orderId} تمّ بنجاح! 
            الحالة ديالك هسع <strong>تمّ الدفع</strong>. غادي ندير الباقي ونشويك الخبر قريب قريب.
          </p>
          <div style="background-color: #d4f4dd; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #28a745;">
            <p style="color: #155724; margin: 0; font-size: 14px;">
              Payment confirmed - We will notify you about next steps soon
            </p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            شكراً على ثقتك في HuParfum!
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 HuParfum - الجزائر
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[OK] Payment confirmation email sent to ${email}`);
    } catch (err) {
        console.error(
            `[ERROR] Failed to send payment confirmation email to ${email}:`,
            err
        );
    }
}

// Send delivery in progress email
async function sendDeliveryInProgressEmail(email, userName, orderId, agency) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Order #${orderId} on Its Way - HuParfum`,
        html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h1 style="color: #d4af37; text-align: center; margin-bottom: 30px;">HuParfum</h1>
          <h2 style="color: #333; margin-bottom: 20px;">يا سلام يا ${userName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            طلبياتك الحمد لله خارج مع وكالة التوصيل! 
            الوكالة: <strong>${agency}</strong>
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            الحالة ديالك هسع <strong>جاري التوصيل</strong>. غادي توصلك قريب قريب!
          </p>
          <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #17a2b8;">
            <p style="color: #0c5460; margin: 0; font-size: 14px;">
              Status: In Transit - Your package will arrive soon
            </p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            إن كان عندك أي سؤال، خاطرنا!
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 HuParfum - الجزائر
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[OK] Delivery in progress email sent to ${email}`);
    } catch (err) {
        console.error(
            `[ERROR] Failed to send delivery in progress email to ${email}:`,
            err
        );
    }
}

// Send delivery complete email
async function sendDeliveryCompleteEmail(email, userName, orderId) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Order #${orderId} Delivered - HuParfum`,
        html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h1 style="color: #d4af37; text-align: center; margin-bottom: 30px;">HuParfum</h1>
          <h2 style="color: #333; margin-bottom: 20px;">الله يبارك يا ${userName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            الطلب #${orderId} توصّل بنجاح!
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            نتمنى تكون راضي على المنتوج. إن كان عندك أي مشكلة، خاطرنا فالفور.
          </p>
          <div style="background-color: #d4f4dd; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #28a745;">
            <p style="color: #155724; margin: 0; font-size: 14px;">
              Successfully Delivered - Thank you for your business!
            </p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            بغيتك حاجة آخرى؟ عندنا ريحات كويسة بزاف!
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 HuParfum - الجزائر
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[OK] Delivery complete email sent to ${email}`);
    } catch (err) {
        console.error(
            `[ERROR] Failed to send delivery complete email to ${email}:`,
            err
        );
    }
}

module.exports = {
    sendVerificationEmail,
    sendOrderConfirmationEmail,
    sendPaymentConfirmationEmail,
    sendDeliveryInProgressEmail,
    sendDeliveryCompleteEmail,
    getArabicStatusLabel,
};
