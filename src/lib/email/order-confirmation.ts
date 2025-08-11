import { Order } from '@/types/database';
import emailService from './email-service';
import { emailConstants } from '@/config/email';

export async function sendOrderConfirmationEmail(order: Order, customerEmail: string) {
  try {
    const orderDate = order.createdAt 
      ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    // Format order items for email
    const orderItemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <div>${item.productName}</div>
            ${item.variantName ? `<div style="font-size: 0.875em; color: #6b7280;">${item.variantName}</div>` : ''}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(
            item.price * item.quantity
          ).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    // Customer email HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - ${emailConstants.companyName}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
            .logo { max-width: 200px; height: auto; }
            .order-details { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { text-align: left; padding: 10px; background-color: #f8f8f8; border-bottom: 2px solid #eee; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${emailConstants.logoUrl}" alt="${emailConstants.companyName}" class="logo">
              <h1>Order Confirmation</h1>
              <p>Thank you for your order!</p>
            </div>

            <div class="order-details">
              <p>Hello ${order.customer?.name || 'Customer'},</p>
              <p>We've received your order #${order.orderNumber} placed on ${orderDate} and it's being processed.</p>
              
              <h3>Order Summary</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="text-align: right; padding: 10px; border-top: 2px solid #eee;">Subtotal:</td>
                    <td style="text-align: right; padding: 10px; border-top: 2px solid #eee;">₹${order.subtotal?.toLocaleString('en-IN') || '0.00'}</td>
                  </tr>
                  ${order.discount && order.discount > 0 ? `
                    <tr>
                      <td colspan="3" style="text-align: right; padding: 10px;">Discount:</td>
                      <td style="text-align: right; padding: 10px;">-₹${order.discount.toLocaleString('en-IN')}</td>
                    </tr>
                  ` : ''}
                  <tr>
                    <td colspan="3" style="text-align: right; padding: 10px;">Shipping:</td>
                    <td style="text-align: right; padding: 10px;">₹${order.shipping?.toLocaleString('en-IN') || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="text-align: right; padding: 10px; font-weight: bold; border-top: 1px solid #eee;">Total:</td>
                    <td style="text-align: right; padding: 10px; font-weight: bold; border-top: 1px solid #eee;">₹${order.total?.toLocaleString('en-IN') || '0.00'}</td>
                  </tr>
                </tfoot>
              </table>

              <h3>Shipping Address</h3>
              <p>
                ${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}<br>
                ${order.shippingAddress?.addressLine1 || ''}<br>
                ${order.shippingAddress?.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
                ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''}<br>
                ${order.shippingAddress?.country || ''}
              </p>

              <p>
                <strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}<br>
                <strong>Payment Status:</strong> ${order.paymentStatus || 'Pending'}
              </p>
            </div>

            <div class="footer">
              <p>If you have any questions about your order, please contact us at <a href="mailto:${emailConstants.companyEmail}">${emailConstants.companyEmail}</a> or call us at ${emailConstants.companyPhone}.</p>
              <p>© ${new Date().getFullYear()} ${emailConstants.companyName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const text = `
      Order Confirmation - ${emailConstants.companyName}
      ${'='.repeat(40)}

      Thank you for your order, ${order.customer?.name || 'Customer'}!
      
      Order #${order.orderNumber}
      Date: ${orderDate}
      
      ORDER SUMMARY:
      ${order.items
        .map(
          (item) =>
            `- ${item.quantity}x ${item.productName} ${
              item.variantName ? `(${item.variantName})` : ''
            } - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
        )
        .join('\n')}
      
      Subtotal: ₹${order.subtotal?.toLocaleString('en-IN') || '0.00'}
      ${order.discount && order.discount > 0 ? `Discount: -₹${order.discount.toLocaleString('en-IN')}\n` : ''}
      Shipping: ₹${order.shipping?.toLocaleString('en-IN') || '0.00'}
      Total: ₹${order.total?.toLocaleString('en-IN') || '0.00'}
      
      SHIPPING ADDRESS:
      ${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}
      ${order.shippingAddress?.addressLine1 || ''}
      ${order.shippingAddress?.addressLine2 || ''}
      ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''}
      ${order.shippingAddress?.country || ''}
      
      PAYMENT METHOD: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
      PAYMENT STATUS: ${order.paymentStatus || 'Pending'}
      
      If you have any questions about your order, please contact us at ${emailConstants.companyEmail} or call us at ${emailConstants.companyPhone}.
      
      © ${new Date().getFullYear()} ${emailConstants.companyName}. All rights reserved.
    `;

    // Send email to customer
    const customerResult = await emailService.sendEmail({
      to: customerEmail,
      bcc: process.env.ORDERS_ALERT_EMAIL,
      subject: emailConstants.templates.orderConfirmation.subject,
      html,
      text,
    });

    if (!customerResult.success) {
      console.error('Failed to send order confirmation to customer:', customerResult.error);
    }

    // Send notification to admin
    const adminResult = await emailService.sendEmail({
      to: emailConfig.adminEmail,
      subject: emailConstants.templates.orderConfirmation.adminSubject,
      html: `
        <p>A new order has been received:</p>
        <p><strong>Order #${order.orderNumber}</strong></p>
        <p><strong>Customer:</strong> ${order.customer?.name || 'N/A'} (${order.customer?.email || 'N/A'})</p>
        <p><strong>Total:</strong> ₹${order.total?.toLocaleString('en-IN') || '0.00'}</p>
        <p><strong>Payment Method:</strong> ${
          order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'
        } (${order.paymentStatus || 'Pending'})</p>
        <p><a href="${emailConstants.websiteUrl}/admin/orders/${order.id}">View Order in Admin Panel</a></p>
      `,
    });

    if (!adminResult.success) {
      console.error('Failed to send order notification to admin:', adminResult.error);
    }

    return {
      customerEmail: customerResult.success,
      adminEmail: adminResult.success,
    };
  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error);
    return {
      customerEmail: false,
      adminEmail: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}
