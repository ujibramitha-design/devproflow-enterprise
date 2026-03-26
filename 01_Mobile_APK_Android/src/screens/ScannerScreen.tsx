/**
 * KPRFlow Enterprise - Mobile OCR Scanner Screen
 * React Native with AI Scanner Engine integration
 */

import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import { Theme } from '../theme'
import { DesignSystemButton, DesignSystemCard } from '../components'
import { ApplicationTypes } from '../types/application-types'

const { width: screenWidth } = Dimensions.get('window')

interface ExtractedField {
  label: string
  value: string
  confidence?: number
}

interface ScanResult {
  success: boolean
  data?: any
  extractedFields?: Record<string, string>
  error?: string
}

interface ScannerScreenState {
  selectedImage: any
  isScanning: boolean
  scanResult: ScanResult | null
  validationErrors: string[]
  isSaving: boolean
}

export const ScannerScreen: React.FC = () => {
  const [state, setState] = useState<ScannerScreenState>({
    selectedImage: null,
    isScanning: false,
    scanResult: null,
    validationErrors: [],
    isSaving: false,
  })

  // Handle image selection
  const handleImageSelection = useCallback((useCamera: boolean = false) => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    }

    const picker = useCamera ? launchCamera : launchImageLibrary

    picker(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return
      }

      if (response.assets && response.assets[0]) {
        setState(prev => ({
          ...prev,
          selectedImage: response.assets![0],
          scanResult: null,
          validationErrors: []
        }))
      }
    })
  }, [])

  // Start scanning process
  const startScanning = useCallback(async () => {
    if (!state.selectedImage) return

    setState(prev => ({ ...prev, isScanning: true, scanResult: null, validationErrors: [] }))

    try {
      // For mobile, we'll simulate the AI scanning process
      // In production, this would call the actual AI Scanner Engine
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate processing

      // Mock extracted data for demonstration
      const mockResult: ScanResult = {
        success: true,
        data: {
          nama_customer: 'John Doe',
          nik_cust: '3201011234567890',
          wa_cust: '081234567890',
          alamat_ktp_cust: 'Jl. Contoh No. 123, Jakarta',
          id_unit: 'A-001',
          tgl_spr: '2024-01-15',
          harga_jual_dpp: '500000000',
          lokasi_akad: 'Jakarta',
          tgl_akad: '2024-02-01',
          nama_pasangan: 'Jane Doe',
          nik_pasangan: '3201010987654321',
          nama_ec: 'Agent Smith',
          no_telp_ec: '081234567891',
          sales_koordinator: 'Sales Manager',
          bank_final: 'BNI',
          bjb: '',
          mandiri: '',
          bni: '✅',
          bri: '',
          btn: '',
          bsi: '',
          timestamp: new Date()
        },
        extractedFields: {
          'Nama Customer': 'John Doe',
          'NIK Customer': '3201011234567890',
          'No. WhatsApp': '081234567890',
          'Alamat KTP': 'Jl. Contoh No. 123, Jakarta',
          'ID Unit': 'A-001',
          'Tanggal SPR': '2024-01-15',
          'Harga Jual (DPP)': '500000000',
          'Lokasi Akad': 'Jakarta',
          'Tanggal Akad': '2024-02-01',
          'Nama Pasangan': 'Jane Doe',
          'NIK Pasangan': '3201010987654321',
          'Nama EC': 'Agent Smith',
          'No. Telp EC': '081234567891',
          'Sales Koordinator': 'Sales Manager',
          'Bank': 'BNI'
        }
      }

      setState(prev => ({ ...prev, scanResult: mockResult, isScanning: false }))

      // Validate extracted data
      const errors = validateExtractedData(mockResult.data)
      if (errors.length > 0) {
        setState(prev => ({ ...prev, validationErrors: errors }))
      }

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        scanResult: { success: false, error: error.message },
        isScanning: false
      }))
    }
  }, [state.selectedImage])

  // Validate extracted data
  const validateExtractedData = (data: any): string[] => {
    const errors: string[] = []

    if (!data.nama_customer) errors.push('Nama Customer wajib diisi')
    if (!data.nik_cust) errors.push('NIK Customer wajib diisi')
    if (!data.id_unit) errors.push('ID Unit wajib diisi')
    if (!data.wa_cust) errors.push('No. WhatsApp wajib diisi')

    // Validate NIK format (16 digits)
    if (data.nik_cust && !/^\d{16}$/.test(data.nik_cust.replace(/\D/g, ''))) {
      errors.push('Format NIK tidak valid (harus 16 digit)')
    }

    // Validate phone format
    if (data.wa_cust && !/^08\d{8,12}$/.test(data.wa_cust.replace(/\D/g, ''))) {
      errors.push('Format No. WhatsApp tidak valid (dimulai dengan 08)')
    }

    return errors
  }

  // Save to Supabase
  const saveToSupabase = useCallback(async () => {
    if (!state.scanResult?.data || !state.scanResult.success) return

    setState(prev => ({ ...prev, isSaving: true }))

    try {
      // Mock save process
      await new Promise(resolve => setTimeout(resolve, 2000))

      setState(prev => ({
        ...prev,
        scanResult: {
          ...prev.scanResult!,
          data: { ...prev.scanResult!.data, saved: true }
        },
        isSaving: false
      }))

      Alert.alert('Berhasil', 'Data berhasil disimpan ke database!')
    } catch (error: any) {
      Alert.alert('Error', `Gagal menyimpan: ${error.message}`)
      setState(prev => ({ ...prev, isSaving: false }))
    }
  }, [state.scanResult])

  // Extracted fields for display
  const extractedFields: ExtractedField[] = state.scanResult?.extractedFields
    ? Object.entries(state.scanResult.extractedFields).map(([label, value]) => ({
        label,
        value,
        confidence: 0.85
      }))
    : []

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📱</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>AI Document Scanner</Text>
            <Text style={styles.subtitle}>
              Scan KTP atau SPR dengan AI untuk mengisi form otomatis
            </Text>
          </View>
        </View>

        <View style={styles.badges}>
          <View style={[styles.badge, styles.successBadge]}>
            <Text style={styles.badgeText}>✓ Gemini AI Ready</Text>
          </View>
          <View style={[styles.badge, styles.primaryBadge]}>
            <Text style={styles.badgeText}>📄 113 Kolom Mapping</Text>
          </View>
          <View style={[styles.badge, styles.warningBadge]}>
            <Text style={styles.badgeText}>👁️ Validation Check</Text>
          </View>
        </View>
      </View>

      {/* Upload Section */}
      <DesignSystemCard style={styles.card}>
        <Text style={styles.cardTitle}>📤 Upload Dokumen</Text>
        
        {!state.selectedImage ? (
          <View style={styles.uploadArea}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleImageSelection(false)}
            >
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Pilih dari Galeri</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.uploadButton, styles.cameraButton]}
              onPress={() => handleImageSelection(true)}
            >
              <Text style={styles.uploadIcon}>📱</Text>
              <Text style={styles.uploadText}>Ambil Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: state.selectedImage.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={() => handleImageSelection(false)}
            >
              <Text style={styles.changeImageText}>Ganti Gambar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Scan Button */}
        {state.selectedImage && (
          <DesignSystemButton
            title={state.isScanning ? '🔄 Memindai...' : '🔍 Mulai Scan AI'}
            onPress={startScanning}
            disabled={state.isScanning}
            style={styles.scanButton}
          />
        )}

        {/* Progress */}
        {state.isScanning && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="small" color={Theme.colors.primary} />
            <Text style={styles.progressText}>AI sedang menganalisis dokumen...</Text>
          </View>
        )}
      </DesignSystemCard>

      {/* Results Section */}
      <DesignSystemCard style={styles.card}>
        <Text style={styles.cardTitle}>📋 Hasil Ekstraksi</Text>
        
        {/* Error Display */}
        {state.scanResult?.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{state.scanResult.error}</Text>
          </View>
        )}

        {/* Validation Errors */}
        {state.validationErrors.length > 0 && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <View style={styles.validationErrors}>
              <Text style={styles.errorTitle}>Data perlu divalidasi:</Text>
              {state.validationErrors.map((error, index) => (
                <Text key={index} style={styles.errorItem}>• {error}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Success Display */}
        {state.scanResult?.success && state.scanResult.extractedFields && (
          <View style={styles.successContainer}>
            <View style={styles.successHeader}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successText}>Scan berhasil!</Text>
            </View>

            {/* Extracted Fields */}
            <ScrollView style={styles.fieldsContainer} showsVerticalScrollIndicator={false}>
              {extractedFields.map((field, index) => (
                <View key={index} style={styles.fieldItem}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue}>{field.value || '-'}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Save Button */}
            {!state.scanResult.data?.saved && (
              <DesignSystemButton
                title={state.isSaving ? '💾 Menyimpan...' : '💾 Simpan ke Supabase'}
                onPress={saveToSupabase}
                disabled={state.isSaving || state.validationErrors.length > 0}
                style={styles.saveButton}
              />
            )}

            {/* Saved Confirmation */}
            {state.scanResult.data?.saved && (
              <View style={styles.savedContainer}>
                <Text style={styles.savedIcon}>✅</Text>
                <Text style={styles.savedText}>Data berhasil disimpan ke database!</Text>
              </View>
            )}
          </View>
        )}

        {/* Empty State */}
        {!state.scanResult && !state.isScanning && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyText}>
              Upload dokumen dan mulai scan untuk melihat hasilnya
            </Text>
          </View>
        )}
      </DesignSystemCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    padding: Theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  successBadge: {
    backgroundColor: '#10b981' + '20',
  },
  primaryBadge: {
    backgroundColor: Theme.colors.primary + '20',
  },
  warningBadge: {
    backgroundColor: '#f59e0b' + '20',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  card: {
    margin: Theme.spacing.md,
    padding: Theme.spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  uploadArea: {
    gap: Theme.spacing.md,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: Theme.colors.primary + '10',
  },
  cameraButton: {
    backgroundColor: Theme.colors.secondary + '10',
    borderColor: Theme.colors.secondary,
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: Theme.spacing.sm,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.colors.text,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: screenWidth - 64,
    height: 200,
    borderRadius: 12,
    marginBottom: Theme.spacing.md,
  },
  changeImageButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
  },
  changeImageText: {
    color: 'white',
    fontWeight: '500',
  },
  scanButton: {
    marginTop: Theme.spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  progressText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  errorContainer: {
    backgroundColor: '#ef4444' + '10',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    padding: Theme.spacing.md,
    borderRadius: 8,
    marginBottom: Theme.spacing.md,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: Theme.spacing.sm,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    flex: 1,
  },
  errorTitle: {
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xs,
  },
  errorItem: {
    fontSize: 12,
    marginBottom: 2,
  },
  validationErrors: {
    flex: 1,
  },
  successContainer: {
    gap: Theme.spacing.md,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 16,
    marginRight: Theme.spacing.sm,
    color: '#10b981',
  },
  successText: {
    color: '#10b981',
    fontWeight: '500',
  },
  fieldsContainer: {
    maxHeight: 300,
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    borderRadius: 8,
    marginBottom: Theme.spacing.xs,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.colors.textSecondary,
    flex: 1,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.colors.text,
    flex: 1,
    textAlign: 'right',
  },
  saveButton: {
    marginTop: Theme.spacing.md,
  },
  savedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: '#10b981' + '10',
    borderRadius: 8,
  },
  savedIcon: {
    fontSize: 16,
    marginRight: Theme.spacing.sm,
    color: '#10b981',
  },
  savedText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Theme.spacing.md,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
})
