// WhatsApp Business API integration for order notifications
// This service handles sending notifications to customers and restaurant staff

export interface WhatsAppMessage {
  to: string;
  message: string;
  type: 'customer' | 'restaurant';
}

export interface OrderNotification {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  estimatedTime?: number;
}

class WhatsAppService {
  private baseUrl = process.env.WHATSAPP_API_URL || '';
  private token = process.env.WHATSAPP_API_TOKEN || '';
  private restaurantPhone = process.env.RESTAURANT_WHATSAPP || '';

  // Format phone number to international format
  private formatPhone(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 9 (Peru mobile), add country code
    if (cleaned.startsWith('9') && cleaned.length === 9) {
      return `51${cleaned}`;
    }
    
    // If it already has country code
    if (cleaned.startsWith('51') && cleaned.length === 11) {
      return cleaned;
    }
    
    return cleaned;
  }

  // Generate customer notification message
  private generateCustomerMessage(order: OrderNotification): string {
    const itemsList = order.items
      .map(item => `• ${item.quantity}x ${item.name} - S/ ${item.price.toFixed(2)}`)
      .join('\n');

    const statusMessages = {
      pending: '⏳ Tu pedido ha sido recibido y está siendo procesado',
      confirmed: '✅ Tu pedido ha sido confirmado',
      preparing: '👨‍🍳 Tu pedido está siendo preparado',
      on_delivery: '🚗 Tu pedido está en camino',
      delivered: '✅ Tu pedido ha sido entregado',
      cancelled: '❌ Tu pedido ha sido cancelado'
    };

    const statusMessage = statusMessages[order.status as keyof typeof statusMessages] || 'Estado actualizado';
    const estimatedTimeText = order.estimatedTime ? `\n⏰ Tiempo estimado: ${order.estimatedTime} minutos` : '';

    return `🍽️ *La Cabañita - Actualización de Pedido*

Hola ${order.customerName}! 👋

${statusMessage}

📋 *Pedido #${order.orderNumber}*
${itemsList}

💰 *Total: S/ ${order.total.toFixed(2)}*${estimatedTimeText}

¡Gracias por elegirnos! 🙏

_Para consultas: ${this.restaurantPhone}_`;
  }

  // Generate restaurant notification message
  private generateRestaurantMessage(order: OrderNotification): string {
    const itemsList = order.items
      .map(item => `• ${item.quantity}x ${item.name}`)
      .join('\n');

    return `🔔 *NUEVO PEDIDO ONLINE*

📋 *Pedido #${order.orderNumber}*
👤 Cliente: ${order.customerName}
📱 Teléfono: ${order.customerPhone}

🍽️ *Productos:*
${itemsList}

💰 *Total: S/ ${order.total.toFixed(2)}*

⚡ Confirmar pedido en el sistema admin`;
  }

  // Send WhatsApp message (mock implementation)
  private async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      // In a real implementation, this would call the WhatsApp Business API
      console.log(`📱 WhatsApp to ${to}:`);
      console.log(message);
      console.log('---');

      // Mock successful response
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  // Send notification to customer
  async notifyCustomer(order: OrderNotification): Promise<boolean> {
    const formattedPhone = this.formatPhone(order.customerPhone);
    const message = this.generateCustomerMessage(order);
    
    return await this.sendMessage(formattedPhone, message);
  }

  // Send notification to restaurant
  async notifyRestaurant(order: OrderNotification): Promise<boolean> {
    if (!this.restaurantPhone) {
      console.warn('Restaurant WhatsApp number not configured');
      return false;
    }

    const formattedPhone = this.formatPhone(this.restaurantPhone);
    const message = this.generateRestaurantMessage(order);
    
    return await this.sendMessage(formattedPhone, message);
  }

  // Send both notifications
  async sendOrderNotifications(order: OrderNotification): Promise<{
    customerSent: boolean;
    restaurantSent: boolean;
  }> {
    const [customerSent, restaurantSent] = await Promise.all([
      this.notifyCustomer(order),
      this.notifyRestaurant(order)
    ]);

    return { customerSent, restaurantSent };
  }

  // Send status update to customer only
  async sendStatusUpdate(order: OrderNotification): Promise<boolean> {
    return await this.notifyCustomer(order);
  }

  // Generate WhatsApp link for manual sending
  generateWhatsAppLink(phone: string, message: string): string {
    const formattedPhone = this.formatPhone(phone);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  }

  // Generate quick message templates
  getQuickTemplates() {
    return {
      orderReady: (customerName: string, orderNumber: string) => 
        `Hola ${customerName}! Tu pedido #${orderNumber} está listo para recoger. ¡Te esperamos! 🍽️`,
      
      delay: (customerName: string, extraMinutes: number) => 
        `Hola ${customerName}! Tu pedido se retrasará ${extraMinutes} minutos adicionales. Disculpa las molestias. 🙏`,
      
      thankYou: (customerName: string) => 
        `¡Gracias por tu pedido, ${customerName}! Esperamos que hayas disfrutado tu comida. ¡Vuelve pronto! 😊`
    };
  }
}

export const whatsappService = new WhatsAppService();