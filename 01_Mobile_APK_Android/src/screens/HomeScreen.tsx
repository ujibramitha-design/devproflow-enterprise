/**
 * KPRFlow Enterprise - Home Screen
 * React Native New Architecture with 05_UI_Design_System consistency
 */

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native'
import { Theme } from '../theme'
import { DesignSystemButton, DesignSystemCard } from '../components'
import { applicationController } from '../services/application-controller'
import { ApplicationTypes } from '../types/application-types'

const { width: screenWidth } = Dimensions.get('window')

interface HomeScreenState {
  applications: ApplicationTypes[]
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
    in_progress: number
  }
  loading: boolean
  refreshing: boolean
}

export const HomeScreen: React.FC = () => {
  const [state, setState] = useState<HomeScreenState>({
    applications: [],
    stats: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      in_progress: 0
    },
    loading: true,
    refreshing: false
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setState((prev: any) => ({ ...prev, loading: true }))
      
      const [applications, stats] = await Promise.all([
        applicationController.getApplications(),
        applicationController.getApplicationStats()
      ])

      setState({
        applications,
        stats,
        loading: false,
        refreshing: false
      })
    } catch (error) {
      console.error('Error loading data:', error)
      setState((prev: any) => ({ ...prev, loading: false, refreshing: false }))
    }
  }

  const onRefresh = () => {
    setState((prev: any) => ({ ...prev, refreshing: true }))
    loadData()
  }

  const getStatusColor = (status: string): string => {
    const statusColors = {
      pending: '#F59E0B',
      in_progress: '#3B82F6', 
      completed: '#10B981',
      failed: '#EF4444',
      cancelled: '#6B7280'
    }
    return statusColors[status as keyof typeof statusColors] || '#6B7280'
  }

  const renderApplicationItem = ({ item }: { item: ApplicationTypes }) => (
    <DesignSystemCard variant="elevated" padding="medium" style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <Text style={styles.applicationNumber}>{item.application_number}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{item.customer_name}</Text>
      <Text style={styles.unitType}>{item.unit_type}</Text>
      
      <View style={styles.applicationFooter}>
        <Text style={styles.progressText}>Progress: {item.progress || 0}%</Text>
        <Text style={styles.priceText}>
          Rp {(item.unit_price || 0).toLocaleString('id-ID')}
        </Text>
      </View>
    </DesignSystemCard>
  )

  if (state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>KPRFlow Enterprise</Text>
        <Text style={styles.subtitle}>Mobile Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{state.stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{state.stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{state.stats.in_progress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{state.stats.approved}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Applications</Text>
      </View>

      <FlatList
        data={state.applications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.applicationsList}
      />

      <View style={styles.actionContainer}>
        <DesignSystemButton
          title="Refresh Data"
          onPress={loadData}
          variant="outline"
          size="medium"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    backgroundColor: Theme.colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primaryForeground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.primaryForeground,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.card,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Theme.colors.mutedForeground,
    marginTop: 4,
  },
  sectionHeader: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.foreground,
  },
  applicationsList: {
    paddingHorizontal: 16,
  },
  applicationCard: {
    marginBottom: 12,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicationNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.foreground,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  customerName: {
    fontSize: 14,
    color: Theme.colors.foreground,
    marginBottom: 4,
  },
  unitType: {
    fontSize: 12,
    color: Theme.colors.mutedForeground,
    marginBottom: 8,
  },
  applicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: Theme.colors.mutedForeground,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  actionContainer: {
    padding: 16,
    paddingTop: 8,
  },
})

export default HomeScreen
