export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          center_id: string
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          date_time: string
          id: string
          service_id: string
          status: Database["public"]["Enums"]["booking_status"] | null
          user_id: string | null
        }
        Insert: {
          center_id: string
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          date_time: string
          id?: string
          service_id: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          user_id?: string | null
        }
        Update: {
          center_id?: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          date_time?: string
          id?: string
          service_id?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "service_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          brand: string
          created_at: string | null
          currency: string | null
          gltf_url: string | null
          id: string
          images: string[] | null
          mileage_km: number | null
          model: string
          price_usd: number
          range_km: number | null
          seo: Json | null
          source_country: string | null
          specs: Json | null
          status: Database["public"]["Enums"]["car_status"] | null
          trim: string | null
          year: number
        }
        Insert: {
          brand: string
          created_at?: string | null
          currency?: string | null
          gltf_url?: string | null
          id?: string
          images?: string[] | null
          mileage_km?: number | null
          model: string
          price_usd: number
          range_km?: number | null
          seo?: Json | null
          source_country?: string | null
          specs?: Json | null
          status?: Database["public"]["Enums"]["car_status"] | null
          trim?: string | null
          year: number
        }
        Update: {
          brand?: string
          created_at?: string | null
          currency?: string | null
          gltf_url?: string | null
          id?: string
          images?: string[] | null
          mileage_km?: number | null
          model?: string
          price_usd?: number
          range_km?: number | null
          seo?: Json | null
          source_country?: string | null
          specs?: Json | null
          status?: Database["public"]["Enums"]["car_status"] | null
          trim?: string | null
          year?: number
        }
        Relationships: []
      }
      "China EV Cars": {
        Row: {
          Brand: string | null
          ChinaOnly: string | null
          Model: string | null
          Notes: string | null
          PrimarySource: string | null
          Year_start: number | null
        }
        Insert: {
          Brand?: string | null
          ChinaOnly?: string | null
          Model?: string | null
          Notes?: string | null
          PrimarySource?: string | null
          Year_start?: number | null
        }
        Update: {
          Brand?: string | null
          ChinaOnly?: string | null
          Model?: string | null
          Notes?: string | null
          PrimarySource?: string | null
          Year_start?: number | null
        }
        Relationships: []
      }
      financing_applications: {
        Row: {
          car_id: string | null
          created_at: string | null
          deposit_percent: number | null
          id: string
          lead_id: string | null
          monthly_payment: number | null
          rate_pct: number | null
          status: Database["public"]["Enums"]["financing_status"] | null
          term_months: number | null
        }
        Insert: {
          car_id?: string | null
          created_at?: string | null
          deposit_percent?: number | null
          id?: string
          lead_id?: string | null
          monthly_payment?: number | null
          rate_pct?: number | null
          status?: Database["public"]["Enums"]["financing_status"] | null
          term_months?: number | null
        }
        Update: {
          car_id?: string | null
          created_at?: string | null
          deposit_percent?: number | null
          id?: string
          lead_id?: string | null
          monthly_payment?: number | null
          rate_pct?: number | null
          status?: Database["public"]["Enums"]["financing_status"] | null
          term_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financing_applications_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financing_applications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      kv_store_32ef3d78: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      leads: {
        Row: {
          calc_snapshot: Json | null
          car_id: string | null
          created_at: string | null
          email: string | null
          id: string
          message: string | null
          name: string
          phone: string
          source: string | null
        }
        Insert: {
          calc_snapshot?: Json | null
          car_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name: string
          phone: string
          source?: string | null
        }
        Update: {
          calc_snapshot?: Json | null
          car_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          items: Json
          payment_method: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          items: Json
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          items?: Json
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          id: string
          images: string[] | null
          price: number
          sku: string
          specs: Json | null
          stock: number | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          images?: string[] | null
          price: number
          sku: string
          specs?: Json | null
          stock?: number | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          images?: string[] | null
          price?: number
          sku?: string
          specs?: Json | null
          stock?: number | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          locale: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          locale?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          locale?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      service_centers: {
        Row: {
          address: string | null
          city: string
          created_at: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          duration_min: number | null
          id: string
          price: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_min?: number | null
          id?: string
          price?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_min?: number | null
          id?: string
          price?: number | null
          title?: string
        }
        Relationships: []
      }
      stats_counters: {
        Row: {
          key: string
          value: number | null
        }
        Insert: {
          key: string
          value?: number | null
        }
        Update: {
          key?: string
          value?: number | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string | null
          id: string
          images: string[] | null
          rating: number | null
          text: string
          user_avatar: string | null
          user_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          images?: string[] | null
          rating?: number | null
          text: string
          user_avatar?: string | null
          user_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          images?: string[] | null
          rating?: number | null
          text?: string
          user_avatar?: string | null
          user_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      car_status: "InStock" | "OnTheWay" | "PreOrder" | "Sold"
      financing_status: "draft" | "submitted" | "approved" | "rejected"
      order_status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      car_status: ["InStock", "OnTheWay", "PreOrder", "Sold"],
      financing_status: ["draft", "submitted", "approved", "rejected"],
      order_status: ["pending", "paid", "shipped", "delivered", "cancelled"],
      user_role: ["admin", "user"],
    },
  },
} as const
