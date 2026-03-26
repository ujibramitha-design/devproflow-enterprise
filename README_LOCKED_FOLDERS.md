# 🔒 LOCKED FOLDERS - CADANGAN READ-ONLY

## 📁 Folder Terkunci (Read-Only Archive)

### **🔒 Folder yang Di-lock:**
- ✅ `bramsray1/` - Google Apps Script Prototype (Read-Only)
- ✅ `bramsray2/` - Node.js Backend API (Read-Only)  
- ✅ `bramsray3/` - Full-Stack Enterprise (Read-Only)

## 🔄 Cara Pakai Folder Terkunci

### **📋 Step 1: Copy Folder**
```bash
# Copy folder yang mau dipakai
Copy-Item "bramsray1" -Destination "bramsray1_copy" -Recurse
Copy-Item "bramsray2" -Destination "bramsray2_copy" -Recurse
Copy-Item "bramsray3" -Destination "bramsray3_copy" -Recurse
```

### **✏️ Step 2: Edit di Copy**
```bash
# Edit di folder copy (bisa diubah)
cd bramsray1_copy
# Edit files di sini...

# Original tetap aman (read-only)
cd ../bramsray1  # Tidak bisa edit
```

### **🗑️ Step 3: Hapus Copy (selesai)
```bash
# Hapus copy-an setelah selesai
Remove-Item "bramsray1_copy" -Recurse -Force
Remove-Item "bramsray2_copy" -Recurse -Force
Remove-Item "bramsray3_copy" -Recurse -Force
```

## ⚠️ Rules Folder Terkunci

### **🚫 Yang TIDAK Boleh:**
- ❌ Edit langsung di folder `bramsray1/`, `bramsray2/`, `bramsray3/`
- ❌ Delete files di folder terkunci
- ❌ Rename folder terkunci
- ❌ Move files dari folder terkunci

### **✅ Yang BOLEH:**
- ✅ Copy folder terkunci
- ✅ Read files di folder terkunci
- ✅ Edit di folder copy-an
- ✅ Delete folder copy-an

## 🎯 Tujuan Lock

### **🛡️ Keamanan:**
- Original tetap aman
- Tidak bisa accidental edit
- Backup otomatis

### **📚 Referensi:**
- Buka untuk referensi
- Copy untuk development
- Original tetap pristine

---

## 🔄 Workflow Development

```
1. Need file dari bramsray1?
   ↓
2. Copy bramsray1 → bramsray1_copy
   ↓
3. Edit di bramsray1_copy
   ↓
4. Selesai → delete bramsray1_copy
   ↓
5. Original bramsray1 tetap aman
```

**Status: 🔒 All legacy folders locked as read-only archive**
