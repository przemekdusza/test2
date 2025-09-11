// lib/supabase.js (stwórz folder lib)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funkcje pomocnicze do bazy danych
export const db = {
  // Użytkownicy
  async createUser(userData) {
    const { data, error } = await supabase
      .from('app_users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserByPhone(phone) {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('phone', phone)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Produkty
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('id')
    
    if (error) throw error
    return data
  },

  // Zamówienia
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async createOrderItems(orderItems) {
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    if (error) throw error
    return data
  },

  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, description)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}
