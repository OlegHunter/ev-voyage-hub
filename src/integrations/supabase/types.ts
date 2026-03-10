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
      brand_models: {
        Row: {
          brand_id: string | null
          class: string | null
          created_at: string | null
          id: string
          model_name: string
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          brand_id?: string | null
          class?: string | null
          created_at?: string | null
          id?: string
          model_name: string
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          brand_id?: string | null
          class?: string | null
          created_at?: string | null
          id?: string
          model_name?: string
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          country: string | null
          created_at: string | null
          description: string | null
          gallery: Json | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      calculator_configs: {
        Row: {
          calculator_type: string
          created_at: string | null
          formula_description: string | null
          formula_js: string
          id: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          calculator_type: string
          created_at?: string | null
          formula_description?: string | null
          formula_js: string
          id?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          calculator_type?: string
          created_at?: string | null
          formula_description?: string | null
          formula_js?: string
          id?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
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
          slug: string | null
          source_country: string | null
          specs: Json | null
          specs_360_url: string | null
          status: Database["public"]["Enums"]["car_status"] | null
          trim: string | null
          video_url: string | null
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
          slug?: string | null
          source_country?: string | null
          specs?: Json | null
          specs_360_url?: string | null
          status?: Database["public"]["Enums"]["car_status"] | null
          trim?: string | null
          video_url?: string | null
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
          slug?: string | null
          source_country?: string | null
          specs?: Json | null
          specs_360_url?: string | null
          status?: Database["public"]["Enums"]["car_status"] | null
          trim?: string | null
          video_url?: string | null
          year?: number
        }
        Relationships: []
      }
      carsBase: {
        Row: {
          ID_MARK: string | null
          MODEL_ID: string | null
          "Год марки до": number | null
          "Год марки от": number | null
          "Год модели до": number | null
          "Год модели от": number | null
          Класс: string | null
          Марка: string | null
          "Марка кириллица": string | null
          Модель: string | null
          "Модель кириллица": string | null
          "Популярная марка": string | null
          Страна: string | null
        }
        Insert: {
          ID_MARK?: string | null
          MODEL_ID?: string | null
          "Год марки до"?: number | null
          "Год марки от"?: number | null
          "Год модели до"?: number | null
          "Год модели от"?: number | null
          Класс?: string | null
          Марка?: string | null
          "Марка кириллица"?: string | null
          Модель?: string | null
          "Модель кириллица"?: string | null
          "Популярная марка"?: string | null
          Страна?: string | null
        }
        Update: {
          ID_MARK?: string | null
          MODEL_ID?: string | null
          "Год марки до"?: number | null
          "Год марки от"?: number | null
          "Год модели до"?: number | null
          "Год модели от"?: number | null
          Класс?: string | null
          Марка?: string | null
          "Марка кириллица"?: string | null
          Модель?: string | null
          "Модель кириллица"?: string | null
          "Популярная марка"?: string | null
          Страна?: string | null
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
      failed_notifications: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          lead_id: string | null
          next_retry_at: string | null
          notification_type: string
          payload: Json | null
          retry_count: number | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          lead_id?: string | null
          next_retry_at?: string | null
          notification_type: string
          payload?: Json | null
          retry_count?: number | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          lead_id?: string | null
          next_retry_at?: string | null
          notification_type?: string
          payload?: Json | null
          retry_count?: number | null
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
      lead_attachments: {
        Row: {
          created_at: string | null
          file_type: string | null
          file_url: string
          id: string
          lead_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          lead_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          lead_id?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          calc_snapshot: Json | null
          car_id: string | null
          created_at: string | null
          crm_id: string | null
          email: string | null
          id: string
          lead_code: string | null
          message: string | null
          name: string
          phone: string
          source: string | null
          source_page: string | null
          telegram_response: Json | null
          telegram_sent: boolean | null
          type: string | null
          utm_params: Json | null
        }
        Insert: {
          calc_snapshot?: Json | null
          car_id?: string | null
          created_at?: string | null
          crm_id?: string | null
          email?: string | null
          id?: string
          lead_code?: string | null
          message?: string | null
          name: string
          phone: string
          source?: string | null
          source_page?: string | null
          telegram_response?: Json | null
          telegram_sent?: boolean | null
          type?: string | null
          utm_params?: Json | null
        }
        Update: {
          calc_snapshot?: Json | null
          car_id?: string | null
          created_at?: string | null
          crm_id?: string | null
          email?: string | null
          id?: string
          lead_code?: string | null
          message?: string | null
          name?: string
          phone?: string
          source?: string | null
          source_page?: string | null
          telegram_response?: Json | null
          telegram_sent?: boolean | null
          type?: string | null
          utm_params?: Json | null
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
      news: {
        Row: {
          author: string | null
          content: string
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          seo: Json | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content: string
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo?: Json | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo?: Json | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
      page_blocks: {
        Row: {
          block_type: string
          content: Json | null
          created_at: string | null
          id: string
          page_id: string | null
          sort_order: number | null
        }
        Insert: {
          block_type: string
          content?: Json | null
          created_at?: string | null
          id?: string
          page_id?: string | null
          sort_order?: number | null
        }
        Update: {
          block_type?: string
          content?: Json | null
          created_at?: string | null
          id?: string
          page_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string | null
          id: string
          published: boolean | null
          seo: Json | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          published?: boolean | null
          seo?: Json | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          published?: boolean | null
          seo?: Json | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          compatible_cars: Json | null
          created_at: string | null
          currency: string | null
          id: string
          images: string[] | null
          price: number
          related_products: Json | null
          sku: string
          slug: string | null
          specs: Json | null
          stock: number | null
          title: string
        }
        Insert: {
          category?: string | null
          compatible_cars?: Json | null
          created_at?: string | null
          currency?: string | null
          id?: string
          images?: string[] | null
          price: number
          related_products?: Json | null
          sku: string
          slug?: string | null
          specs?: Json | null
          stock?: number | null
          title: string
        }
        Update: {
          category?: string | null
          compatible_cars?: Json | null
          created_at?: string | null
          currency?: string | null
          id?: string
          images?: string[] | null
          price?: number
          related_products?: Json | null
          sku?: string
          slug?: string | null
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
      service_types: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          price_from: number | null
          slug: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          price_from?: number | null
          slug: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          price_from?: number | null
          slug?: string
          title?: string
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
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      car_status: ["InStock", "OnTheWay", "PreOrder", "Sold"],
      financing_status: ["draft", "submitted", "approved", "rejected"],
      order_status: ["pending", "paid", "shipped", "delivered", "cancelled"],
      user_role: ["admin", "user"],
    },
  },
} as const
