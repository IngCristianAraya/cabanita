export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          address: string
          logo_url: string | null
          primary_color: string
          delivery_fee: number
          min_order_amount: number
          is_open: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email: string
          address: string
          logo_url?: string | null
          primary_color?: string
          delivery_fee?: number
          min_order_amount?: number
          is_open?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string
          address?: string
          logo_url?: string | null
          primary_color?: string
          delivery_fee?: number
          min_order_amount?: number
          is_open?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          display_order: number
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          display_order?: number
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          ingredients: string[] | null
          spicy_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          ingredients?: string[] | null
          spicy_level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          ingredients?: string[] | null
          spicy_level?: number
          created_at?: string
          updated_at?: string
        }
      }
      daily_menus: {
        Row: {
          id: string
          menu_date: string
          is_published: boolean
          special_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          menu_date: string
          is_published?: boolean
          special_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          menu_date?: string
          is_published?: boolean
          special_note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_menu_items: {
        Row: {
          id: string
          daily_menu_id: string
          menu_item_id: string
          is_available: boolean
          special_price: number | null
        }
        Insert: {
          id?: string
          daily_menu_id: string
          menu_item_id: string
          is_available?: boolean
          special_price?: number | null
        }
        Update: {
          id?: string
          daily_menu_id?: string
          menu_item_id?: string
          is_available?: boolean
          special_price?: number | null
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          phone: string
          email: string | null
          default_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          full_name: string
          phone: string
          email?: string | null
          default_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          full_name?: string
          phone?: string
          email?: string | null
          default_address?: string | null
          created_at?: string
        }
      }
      delivery_zones: {
        Row: {
          id: string
          name: string
          delivery_fee: number
          min_order_amount: number
          estimated_time_minutes: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          delivery_fee: number
          min_order_amount?: number
          estimated_time_minutes?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          delivery_fee?: number
          min_order_amount?: number
          estimated_time_minutes?: number
          is_active?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          delivery_zone_id: string | null
          customer_name: string
          customer_phone: string
          customer_email: string | null
          delivery_address: string
          subtotal: number
          delivery_fee: number
          total: number
          payment_method: 'cash' | 'yape' | 'plin' | 'card'
          payment_status: 'pending' | 'completed' | 'failed'
          order_status: 'pending' | 'confirmed' | 'preparing' | 'on_delivery' | 'delivered' | 'cancelled'
          notes: string | null
          estimated_delivery_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id?: string | null
          delivery_zone_id?: string | null
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          delivery_address: string
          subtotal: number
          delivery_fee: number
          total: number
          payment_method: 'cash' | 'yape' | 'plin' | 'card'
          payment_status?: 'pending' | 'completed' | 'failed'
          order_status?: 'pending' | 'confirmed' | 'preparing' | 'on_delivery' | 'delivered' | 'cancelled'
          notes?: string | null
          estimated_delivery_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string | null
          delivery_zone_id?: string | null
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          delivery_address?: string
          subtotal?: number
          delivery_fee?: number
          total?: number
          payment_method?: 'cash' | 'yape' | 'plin' | 'card'
          payment_status?: 'pending' | 'completed' | 'failed'
          order_status?: 'pending' | 'confirmed' | 'preparing' | 'on_delivery' | 'delivered' | 'cancelled'
          notes?: string | null
          estimated_delivery_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string | null
          quantity: number
          unit_price: number
          subtotal: number
          special_instructions: string | null
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id?: string | null
          quantity: number
          unit_price: number
          subtotal: number
          special_instructions?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string | null
          quantity?: number
          unit_price?: number
          subtotal?: number
          special_instructions?: string | null
        }
      }
    }
  }
}

export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type DeliveryZone = Database['public']['Tables']['delivery_zones']['Row'];
export type Restaurant = Database['public']['Tables']['restaurants']['Row'];
