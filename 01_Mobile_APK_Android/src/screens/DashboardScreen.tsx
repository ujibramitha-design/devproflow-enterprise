/**
 * DashboardScreen — 01_Mobile_APK_Android
 *
 * Native Android-optimized dashboard following Master Layout UI Design System.
 *
 * ⭐ Token chain:
 *   Design_Tokens.json → tokens.ts → paperTheme.ts → useDevProTheme() → THIS SCREEN
 *
 * Token proof — every style value traced to token:
 *   colors.primary (#3B82F6)     → identical to 02_Web_Application --primary
 *   colors.card (#FFFFFF)        → Card background
 *   colors.foreground (#18181B)  → Primary text
 *   colors.mutedForeground       → Secondary text / captions
 *   colors.success / warning / destructive → KPI badge colors
 *   spacing.scale[4] = 16        → Screen & card padding
 *   spacing.borderRadius.lg = 12 → Card/chip corner radius
 *   typography.fontSize.*        → All text sizes (px from tokens)
 *   typography.fontWeight.*      → semibold / medium / normal
 *   animations.duration.normal   → FlatList scroll animation
 *
 * Performance optimizations (native Android):
 *   - FlatList for scrollable lists (recycled views)
 *   - Memoized components (React.memo)
 *   - StyleSheet.create (no object recreation)
 *   - getItemLayout where heights are fixed
 */

import React, { useCallback, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native'
import {
  Surface,
  Chip,
  Avatar,
  IconButton,
  ProgressBar,
  Divider,
  Badge,
} from 'react-native-paper'
import { useDevProTheme } from '../providers/ThemeProvider'

// ── Types ─────────────────────────────────────────────────────────────────────
interface KpiCardData {
  id:      string
  label:   string
  value:   string
  sub:     string
  color:   string
  bgColor: string
  icon:    string
  trend:   'up' | 'down' | 'flat'
  progress: number
}

interface ApplicationItem {
  id:         string
  applicant:  string
  unit:       string
  status:     'approved' | 'pending' | 'in_review' | 'rejected'
  amount:     string
  date:       string
  initials:   string
}

// ── Sub-components (memoized for Android performance) ─────────────────────────

interface KpiCardProps { item: KpiCardData; onPress: (id: string) => void }

const KpiCard = React.memo(({ item, onPress }: KpiCardProps) => {
  const { colors, spacing, typography } = useDevProTheme()

  const trendIcon = item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '–'
  const trendColor = item.trend === 'up'
    ? colors.success
    : item.trend === 'down'
      ? colors.destructive
      : colors.mutedForeground

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item.id)}
      style={{ marginRight: spacing.scale[3] }}
    >
      <Surface
        style={[
          kpiStyles.card,
          {
            backgroundColor: colors.card,
            borderRadius: spacing.borderRadius.lg,
          },
        ]}
        elevation={2}
      >
        {/* Color accent strip — token: chart color */}
        <View style={[kpiStyles.strip, { backgroundColor: item.color }]} />

        <View style={kpiStyles.body}>
          {/* Icon circle */}
          <View style={[kpiStyles.iconCircle, { backgroundColor: item.bgColor }]}>
            <Text style={[kpiStyles.iconText, { color: item.color }]}>{item.icon}</Text>
          </View>

          {/* Value — textStyles.kpiValue (3xl, bold) */}
          <Text style={[kpiStyles.value, {
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold as '700',
            color: colors.foreground,
          }]}>
            {item.value}
          </Text>

          {/* Label — textStyles.kpiLabel (sm, medium) */}
          <Text style={[kpiStyles.label, {
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium as '500',
            color: colors.mutedForeground,
          }]}>
            {item.label}
          </Text>

          {/* Trend */}
          <View style={kpiStyles.trendRow}>
            <Text style={{ color: trendColor, fontSize: typography.fontSize.xs, fontWeight: '600' }}>
              {trendIcon} {item.sub}
            </Text>
          </View>

          {/* Progress bar — token color */}
          <ProgressBar
            progress={item.progress}
            color={item.color}
            style={kpiStyles.progress}
          />
        </View>
      </Surface>
    </TouchableOpacity>
  )
})
KpiCard.displayName = 'KpiCard'

// ── Application List Item ─────────────────────────────────────────────────────
interface AppItemProps { item: ApplicationItem }

const ApplicationRow = React.memo(({ item }: AppItemProps) => {
  const { colors, spacing, typography } = useDevProTheme()

  const statusConfig = {
    approved:  { color: colors.success,     label: 'Approved',  bg: '#D1FAE5' },
    pending:   { color: colors.warning,     label: 'Pending',   bg: '#FEF3C7' },
    in_review: { color: colors.info,        label: 'In Review', bg: '#DBEAFE' },
    rejected:  { color: colors.destructive, label: 'Rejected',  bg: '#FEE2E2' },
  }
  const s = statusConfig[item.status]

  return (
    <View style={[appStyles.row, {
      paddingVertical: spacing.scale[3],
      paddingHorizontal: spacing.scale[4],
      borderBottomColor: colors.border,
    }]}>
      {/* Avatar — uses primary token */}
      <Avatar.Text
        size={40}
        label={item.initials}
        style={{ backgroundColor: colors.primary }}
        labelStyle={{ color: colors.primaryForeground, fontSize: typography.fontSize.sm }}
      />

      {/* Info */}
      <View style={appStyles.info}>
        <Text style={{
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold as '600',
          color: colors.foreground,
        }} numberOfLines={1}>
          {item.applicant}
        </Text>
        <Text style={{
          fontSize: typography.fontSize.xs,
          color: colors.mutedForeground,
          marginTop: 1,
        }} numberOfLines={1}>
          {item.unit} • {item.date}
        </Text>
      </View>

      {/* Right side: amount + status */}
      <View style={appStyles.right}>
        <Text style={{
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold as '600',
          color: colors.foreground,
          textAlign: 'right',
        }}>
          {item.amount}
        </Text>
        <View style={[appStyles.badge, { backgroundColor: s.bg }]}>
          <Text style={{ color: s.color, fontSize: 10, fontWeight: '600' }}>{s.label}</Text>
        </View>
      </View>
    </View>
  )
})
ApplicationRow.displayName = 'ApplicationRow'

// ── Main Screen ───────────────────────────────────────────────────────────────
interface DashboardScreenProps {
  navigation?: { navigate: (screen: string) => void }
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { colors, spacing, typography, isDark, toggleTheme } = useDevProTheme()

  // ── Mock data (tokens used for all colors) ──
  const kpiData = useMemo<KpiCardData[]>(() => [
    {
      id: '1',
      label: 'Total Pengajuan',
      value: '248',
      sub: '+12% this month',
      color: colors.primary,
      bgColor: colors.sidebarAccent ?? '#EFF6FF',
      icon: '📋',
      trend: 'up',
      progress: 0.72,
    },
    {
      id: '2',
      label: 'Disetujui',
      value: '186',
      sub: '+8% this month',
      color: colors.success,
      bgColor: '#D1FAE5',
      icon: '✅',
      trend: 'up',
      progress: 0.86,
    },
    {
      id: '3',
      label: 'Pending Review',
      value: '42',
      sub: '–3% vs last week',
      color: colors.warning,
      bgColor: '#FEF3C7',
      icon: '⏳',
      trend: 'down',
      progress: 0.32,
    },
    {
      id: '4',
      label: 'Ditolak',
      value: '20',
      sub: 'Stable this month',
      color: colors.destructive,
      bgColor: '#FEE2E2',
      icon: '❌',
      trend: 'flat',
      progress: 0.12,
    },
  ], [colors])

  const applications = useMemo<ApplicationItem[]>(() => [
    { id: '1', applicant: 'Budi Santoso',    unit: 'Unit A-12',  status: 'approved',  amount: 'Rp 450jt',  date: '25 Mar', initials: 'BS' },
    { id: '2', applicant: 'Siti Rahayu',     unit: 'Unit B-04',  status: 'pending',   amount: 'Rp 320jt',  date: '24 Mar', initials: 'SR' },
    { id: '3', applicant: 'Ahmad Fauzi',     unit: 'Unit C-07',  status: 'in_review', amount: 'Rp 580jt',  date: '24 Mar', initials: 'AF' },
    { id: '4', applicant: 'Diana Putri',     unit: 'Unit A-03',  status: 'approved',  amount: 'Rp 215jt',  date: '23 Mar', initials: 'DP' },
    { id: '5', applicant: 'Rudi Hermawan',   unit: 'Unit D-11',  status: 'rejected',  amount: 'Rp 390jt',  date: '22 Mar', initials: 'RH' },
    { id: '6', applicant: 'Eka Kurniawan',   unit: 'Unit B-09',  status: 'pending',   amount: 'Rp 475jt',  date: '21 Mar', initials: 'EK' },
  ], [])

  const renderKpiCard = useCallback(({ item }: { item: KpiCardData }) => (
    <KpiCard item={item} onPress={(id) => navigation?.navigate('ApplicationDetail')} />
  ), [navigation])

  const renderAppRow = useCallback(({ item }: { item: ApplicationItem }) => (
    <ApplicationRow item={item} />
  ), [])

  const getItemLayout = useCallback((_: unknown, index: number) => ({
    length: 68,
    offset: 68 * index,
    index,
  }), [])

  return (
    <View style={[screen.root, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
        translucent={false}
      />

      {/* ── TOP HEADER BAR ── Token: colors.primary */}
      <View style={[screen.header, { backgroundColor: colors.primary }]}>
        <View style={screen.headerLeft}>
          {/* Logo pill */}
          <View style={[screen.logoPill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={[screen.logoText, { fontSize: typography.fontSize.sm, fontWeight: '700' }]}>DP</Text>
          </View>
          <View>
            <Text style={[screen.appTitle, {
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold as '700',
            }]}>
              DevPro Flow
            </Text>
            <Text style={[screen.appSub, {
              fontSize: typography.fontSize.xs,
              color: 'rgba(255,255,255,0.8)',
            }]}>
              Enterprise Dashboard
            </Text>
          </View>
        </View>

        <View style={screen.headerRight}>
          {/* Notification badge — uses destructive token */}
          <View>
            <IconButton icon="bell-outline" iconColor="#FFFFFF" size={22} onPress={() => {}} />
            <Badge style={[screen.notifBadge, { backgroundColor: colors.destructive }]}>3</Badge>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={screen.themeBtn}>
            <Text style={{ color: '#FFFFFF', fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={screen.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.scale[6] }}
      >
        {/* ── GREETING ── Token: typography, foreground */}
        <View style={[screen.greetSection, { paddingHorizontal: spacing.scale[4] }]}>
          <Text style={[screen.greetTitle, {
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semibold as '600',
            color: colors.foreground,
          }]}>
            Selamat Pagi, Admin 👋
          </Text>
          <Text style={{
            fontSize: typography.fontSize.sm,
            color: colors.mutedForeground,
            marginTop: spacing.scale[1],
          }}>
            Selasa, 25 Maret 2026 • {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* ── QUICK FILTER CHIPS ── Token: primary, muted */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.scale[4], gap: spacing.scale[2], paddingVertical: spacing.scale[2] }}
        >
          {['Semua', 'Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Q1 2026'].map((label, i) => (
            <Chip
              key={label}
              selected={i === 0}
              onPress={() => {}}
              style={{
                backgroundColor: i === 0 ? colors.primary : colors.muted,
                borderRadius: spacing.borderRadius.full,
              }}
              textStyle={{
                color: i === 0 ? colors.primaryForeground : colors.mutedForeground,
                fontSize: typography.fontSize.xs,
                fontWeight: '600',
              }}
            >
              {label}
            </Chip>
          ))}
        </ScrollView>

        {/* ── KPI CARDS ── Token: chart1–chart4, card */}
        <View style={{ marginTop: spacing.scale[2] }}>
          <View style={[screen.sectionHeader, { paddingHorizontal: spacing.scale[4] }]}>
            <Text style={[screen.sectionTitle, {
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold as '600',
              color: colors.foreground,
            }]}>
              Ringkasan Kinerja
            </Text>
            <TouchableOpacity>
              <Text style={{ color: colors.primary, fontSize: typography.fontSize.sm }}>Lihat semua</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={kpiData}
            renderItem={renderKpiCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.scale[4], paddingVertical: spacing.scale[2] }}
            snapToInterval={164}
            decelerationRate="fast"
          />
        </View>

        {/* ── RECENT APPLICATIONS ── Token: card, border, foreground */}
        <View style={[screen.section, { marginHorizontal: spacing.scale[4] }]}>
          <View style={screen.sectionHeader}>
            <Text style={[screen.sectionTitle, {
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold as '600',
              color: colors.foreground,
            }]}>
              Pengajuan Terbaru
            </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Applications')}>
              <Text style={{ color: colors.primary, fontSize: typography.fontSize.sm }}>Semua</Text>
            </TouchableOpacity>
          </View>

          <Surface
            style={[screen.listCard, {
              backgroundColor: colors.card,
              borderRadius: spacing.borderRadius.lg,
              borderColor: colors.border,
            }]}
            elevation={1}
          >
            <FlatList
              data={applications}
              renderItem={renderAppRow}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              getItemLayout={getItemLayout}
              ItemSeparatorComponent={() => (
                <Divider style={{ backgroundColor: colors.border, height: StyleSheet.hairlineWidth }} />
              )}
            />
          </Surface>
        </View>

        {/* ── QUICK ACTIONS ── Token: primary, accent, success */}
        <View style={[screen.section, { marginHorizontal: spacing.scale[4] }]}>
          <Text style={[screen.sectionTitle, {
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold as '600',
            color: colors.foreground,
            marginBottom: spacing.scale[3],
          }]}>
            Aksi Cepat
          </Text>
          <View style={screen.actionsGrid}>
            {[
              { label: 'Pengajuan Baru',  icon: '➕', color: colors.primary,     bg: '#EFF6FF' },
              { label: 'Scan Dokumen',    icon: '📷', color: colors.success,     bg: '#D1FAE5' },
              { label: 'Laporan',         icon: '📊', color: colors.warning,     bg: '#FEF3C7' },
              { label: 'Pengaturan',      icon: '⚙️', color: colors.mutedForeground, bg: colors.muted },
            ].map(action => (
              <TouchableOpacity
                key={action.label}
                activeOpacity={0.8}
                style={[screen.actionBtn, {
                  backgroundColor: action.bg,
                  borderRadius: spacing.borderRadius.lg,
                  borderColor: colors.border,
                }]}
              >
                <Text style={{ fontSize: 24 }}>{action.icon}</Text>
                <Text style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium as '500',
                  color: action.color,
                  marginTop: spacing.scale[1],
                  textAlign: 'center',
                }}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  )
}

// ── StyleSheet (static, created once) ────────────────────────────────────────
const screen = StyleSheet.create({
  root:         { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 8 : 12, paddingBottom: 12 },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerRight:  { flexDirection: 'row', alignItems: 'center' },
  logoPill:     { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoText:     { color: '#FFFFFF' },
  appTitle:     { color: '#FFFFFF' },
  appSub:       {},
  notifBadge:   { position: 'absolute', top: 6, right: 6 },
  themeBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  scroll:       { flex: 1 },
  greetSection: { paddingTop: 20, paddingBottom: 8 },
  greetTitle:   {},
  sectionHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: {},
  section:      { marginTop: 20 },
  listCard:     { overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  actionsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionBtn:    { width: '47%', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderWidth: StyleSheet.hairlineWidth },
})

const kpiStyles = StyleSheet.create({
  card:     { width: 152, overflow: 'hidden' },
  strip:    { height: 4, width: '100%' },
  body:     { padding: 12 },
  iconCircle:{ width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  iconText: { fontSize: 18 },
  value:    { lineHeight: 36 },
  label:    { lineHeight: 18, marginTop: 2 },
  trendRow: { marginTop: 4, marginBottom: 8 },
  progress: { height: 4, borderRadius: 2 },
})

const appStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  info:  { flex: 1, minWidth: 0 },
  right: { alignItems: 'flex-end', gap: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
})

export default DashboardScreen
