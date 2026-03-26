# Free Domain Setup Guide - devproflow.tk

## 🎯 STEP 1: SETUP DOMAIN GRATIS (FREENOM)

### **🌐 DOMAIN REGISTRATION:**

#### **📋 LANGKAH-LANGKAH:**

**1. Buka Freenom**
```
URL: https://www.freenom.com
```

**2. Cari Domain**
```
- Masukkan "devproflow" di search box
- Pilih extension: .tk (gratis)
- Check availability
```

**3. Register Domain**
```
- Click "Checkout"
- Pilih periode: 12 months (gratis)
- Masukkan email address
- Verifikasi email
```

**4. Configure DNS**
```
- Login ke Freenom dashboard
- Pilih domain devproflow.tk
- Go to "Manage Domain" -> "Manage Freenom DNS"
```

**5. DNS Records untuk Vercel**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600

Type: CNAME
Name: api
Value: cname.vercel-dns.com
TTL: 3600
```

**6. Save DNS Settings**
```
- Click "Save Changes"
- Wait 5-30 minutes for propagation
```

### **✅ ALTERNATIVE DOMAIN OPTIONS:**
- **devproflow.ml** (Freenom)
- **devproflow.ga** (Freenom)
- **devproflow.cf** (Cloudflare)

### **🔍 VERIFICATION:**
```bash
# Test domain resolution
nslookup devproflow.tk
ping devproflow.tk
```

---

## 📊 DOMAIN STATUS CHECKLIST

- [ ] Domain registered successfully
- [ ] DNS records configured
- [ ] Domain propagation complete
- [ ] SSL certificate ready
- [ ] Ready for Vercel connection

---

## 🚀 NEXT STEPS

**Setelah domain aktif, lanjut ke:**
1. Setup Vercel Free account
2. Deploy web application
3. Connect domain ke Vercel
4. Test complete deployment

---

## ⚠️ IMPORTANT NOTES

- **Domain Duration**: 12 months gratis, renewable
- **DNS Propagation**: 5-30 minutes
- **SSL Certificate**: Automatic dengan Vercel
- **Cost**: 100% gratis
- **Renewal**: Automatic renewal available
