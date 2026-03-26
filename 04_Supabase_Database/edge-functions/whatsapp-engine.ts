// WhatsApp Engine Edge Function - bramsray2
// KPRFlow Enterprise WhatsApp Integration
//
// ⚠️ TEMPORARILY DISABLED - AI & AUDIT PHASE
// This Edge Function is disabled and will only return mock responses
// No actual WhatsApp API calls will be made

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessage {
  to: string
  type: 'text' | 'document' | 'image'
  content: string
  fileName?: string
  fileUrl?: string
}

interface NotificationData {
  userId?: string
  title: string
  message: string
  type: 'lead_generated' | 'status_change' | 'document_uploaded' | 'unit_cancelled' | 'payment_reminder'
  data?: Record<string, any>
  referenceId?: string
}

// Send WhatsApp notification
async function sendWhatsAppNotification(
  data: NotificationData,
  supabase: any,
  waApiKey: string,
  waGatewayUrl: string
) {
  try {
    // Get user phone number
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('phone, full_name')
      .eq('id', data.userId)
      .single()

    if (userError || !user) {
      throw new Error('User not found')
    }

    // Prepare WhatsApp message
    const message: WhatsAppMessage = {
      to: user.phone,
      type: 'text',
      content: `🏠 KPRFlow Enterprise\n\n${data.title}\n${data.message}\n\nTerima kasih,\nKPRFlow Team`
    }

    // Send to WhatsApp API
    const response = await fetch(`${waGatewayUrl}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${waApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message')
    }

    // Log notification
    await supabase
      .from('notification_logs')
      .insert({
        user_id: data.userId,
        notification_type: 'WHATSAPP',
        title: data.title,
        message: data.message,
        channel: 'WHATSAPP',
        status: 'SENT',
        metadata: {
          type: data.type,
          referenceId: data.referenceId,
          phoneNumber: user.phone
        }
      })

    return { success: true, messageId: 'whatsapp_' + Date.now() }
  } catch (error) {
    console.error('WhatsApp notification error:', error)
    return { success: false, error: error.message }
  }
}

// Send bulk WhatsApp notifications
async function sendBulkWhatsAppNotifications(
  notifications: NotificationData[],
  supabase: any,
  waApiKey: string,
  waGatewayUrl: string
) {
  const results = []

  for (const notification of notifications) {
    const result = await sendWhatsAppNotification(
      notification,
      supabase,
      waApiKey,
      waGatewayUrl
    )
    results.push(result)
  }

  return results
}

// Get WhatsApp templates
async function getWhatsAppTemplates(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .select('*')
      .eq('is_active', true)

    if (error) throw error
    return { success: true, templates: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Main function - DISABLED FOR AUDIT PHASE
serve(async (req: any) => {
  console.log('🔒 WhatsApp Engine Edge Function called - FEATURE DISABLED FOR AUDIT')
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Mock response - no actual WhatsApp operations
  const mockResponse = {
    success: true,
    message: 'WhatsApp Engine temporarily disabled for audit phase',
    timestamp: new Date().toISOString(),
    action: 'mocked_response'
  }

  try {
    if (req.method === 'POST') {
      const body = await req.json()
      console.log('🔒 MOCK: Would process WhatsApp request:', body)
      
      return new Response(
        JSON.stringify(mockResponse),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    return new Response(
      JSON.stringify({ ...mockResponse, error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error: any) {
    console.log('🔒 MOCK: Error in WhatsApp Engine (mocked):', error.message)
    return new Response(
      JSON.stringify({ 
        ...mockResponse, 
        error: 'WhatsApp Engine disabled for audit phase',
        originalError: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
