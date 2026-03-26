// Firebase Configuration from DevPro-Enterprise
export const firebaseConfig = {
  apiKey: "AIzaSyCbansDtOw7APATgvH7R57F8JgmK7d3Kt0",
  authDomain: "studio-3370673271-c1d4f.firebaseapp.com",
  databaseURL: "https://studio-3370673271-c1d4f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "studio-3370673271-c1d4f",
  storageBucket: "studio-3370673271-c1d4f.firebasestorage.app",
  messagingSenderId: "936379412534",
  appId: "1:936379412534:web:9409b2e9e03d86bc6ce897",
  measurementId: "G-DDMNTQXP7H"
}

// Firebase Real-time Database paths
export const FIREBASE_PATHS = {
  SUBSIDI: "SUBSIDI",
  UNITS: "units",
  CUSTOMERS: "customers",
  APPLICATIONS: "applications",
  TRANSACTIONS: "transactions"
}

// WhatsApp Business configuration
export const WHATSAPP_CONFIG = {
  phoneNumber: "6287808131319",
  baseUrl: "https://wa.me/",
  templates: {
    UNIT_INQUIRY: "Halo Admin, saya tertarik booking unit Blok: {unitId} di Lafara Project. Mohon info detailnya.",
    APPLICATION_STATUS: "Halo, status aplikasi Anda untuk unit {unitId} adalah {status}.",
    PAYMENT_REMINDER: "Pengingat pembayaran untuk unit {unitId}. Jumlah: Rp {amount}."
  }
}
