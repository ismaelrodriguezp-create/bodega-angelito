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
      stores: {
        Row: {
          id: string
          name: string
          address: string
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          barcode: string | null
          sku: string | null
          name: string
          description: string | null
          brand: string | null
          category_id: string | null
          image_url: string | null
          price: number
          cost: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barcode?: string | null
          sku?: string | null
          name: string
          description?: string | null
          brand?: string | null
          category_id?: string | null
          image_url?: string | null
          price: number
          cost: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barcode?: string | null
          sku?: string | null
          name?: string
          description?: string | null
          brand?: string | null
          category_id?: string | null
          image_url?: string | null
          price?: number
          cost?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      stock_levels: {
        Row: {
          id: string
          store_id: string
          product_id: string
          current_stock: number
          minimum_stock: number
          safety_stock: number
          location_in_store: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          product_id: string
          current_stock?: number
          minimum_stock?: number
          safety_stock?: number
          location_in_store?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          product_id?: string
          current_stock?: number
          minimum_stock?: number
          safety_stock?: number
          location_in_store?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_levels_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_levels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          store_id: string
          customer_id: string | null
          status: Database['public']['Enums']['order_status']
          payment_status: Database['public']['Enums']['payment_status']
          total_amount: number
          payment_gateway: string | null
          gateway_reference: string | null
          delivery_address: string | null
          delivery_lat: number | null
          delivery_lng: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          customer_id?: string | null
          status?: Database['public']['Enums']['order_status']
          payment_status?: Database['public']['Enums']['payment_status']
          total_amount: number
          payment_gateway?: string | null
          gateway_reference?: string | null
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          customer_id?: string | null
          status?: Database['public']['Enums']['order_status']
          payment_status?: Database['public']['Enums']['payment_status']
          total_amount?: number
          payment_gateway?: string | null
          gateway_reference?: string | null
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      workers: {
        Row: {
          id: string
          store_id: string
          auth_user_id: string | null
          first_name: string
          last_name: string
          role: Database['public']['Enums']['worker_role']
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          auth_user_id?: string | null
          first_name: string
          last_name: string
          role?: Database['public']['Enums']['worker_role']
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          auth_user_id?: string | null
          first_name?: string
          last_name?: string
          role?: Database['public']['Enums']['worker_role']
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          auth_user_id: string | null
          first_name: string
          last_name: string
          phone: string | null
          loyalty_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          first_name: string
          last_name: string
          phone?: string | null
          loyalty_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          first_name?: string
          last_name?: string
          phone?: string | null
          loyalty_points?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          id: string
          store_id: string
          product_id: string
          quantity: number
          movement_type: Database['public']['Enums']['movement_type']
          reference_id: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          product_id: string
          quantity: number
          movement_type: Database['public']['Enums']['movement_type']
          reference_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          product_id?: string
          quantity?: number
          movement_type?: Database['public']['Enums']['movement_type']
          reference_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          worker_id: string | null
          title: string
          body: string
          is_read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          worker_id?: string | null
          title: string
          body: string
          is_read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          worker_id?: string | null
          title?: string
          body?: string
          is_read?: boolean
          data?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {
      create_product_with_stock: {
        Args: {
          p_store_id: string
          p_name: string
          p_brand?: string | null
          p_sku?: string | null
          p_barcode?: string | null
          p_description?: string | null
          p_category_id?: string | null
          p_price?: number
          p_cost?: number
          p_initial_stock?: number
          p_minimum_stock?: number
          p_safety_stock?: number
          p_location_in_store?: string | null
        }
        Returns: string
      }
      get_current_worker_role: {
        Args: Record<PropertyKey, never>
        Returns: Database['public']['Enums']['worker_role']
      }
      get_current_worker_store: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      order_status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status: 'unpaid' | 'paid' | 'refunded'
      worker_role: 'admin' | 'manager' | 'cashier' | 'picker'
      movement_type: 'initial' | 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'waste'
    }
  }
}
