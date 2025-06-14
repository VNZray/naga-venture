import { ThemedText } from '@/components/ThemedText';
import CardContainer from '@/components/web-components/CardContainer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
type MaterialCommunityIconName =
  | 'chart-bar'
  | 'calendar-check'
  | 'cash-multiple'
  | 'star'
  | 'eye'
  | 'account-group'
  | 'bed-empty'
  | 'currency-usd'
  | 'calendar-month'
  | 'calendar-range';

const dashboardOverview: {
  label: string;
  value: string;
  icon: MaterialCommunityIconName;
  color: string;
}[] = [
  {
    label: 'Current Occupancy Rate',
    value: '75%',
    icon: 'chart-bar',
    color: '#DEE3F2',
  },
  {
    label: 'Upcoming Reservations',
    value: '5 this week',
    icon: 'calendar-check',
    color: '#DEE3F2',
  },
  {
    label: 'Monthly Revenue',
    value: '₱45,000',
    icon: 'cash-multiple',
    color: '#DEE3F2',
  },
  { label: 'Average Rating', value: '4.3 ★', icon: 'star', color: '#DEE3F2' },
  {
    label: 'Total Profile Visits',
    value: '1,230',
    icon: 'eye',
    color: '#DEE3F2',
  },
  {
    label: 'Currently Checked-in',
    value: '8',
    icon: 'account-group',
    color: '#DEE3F2',
  },
  {
    label: 'Available Rooms',
    value: '12',
    icon: 'bed-empty',
    color: '#DEE3F2',
  },
  {
    label: 'Annual Revenue',
    value: '₱920,000',
    icon: 'currency-usd',
    color: '#DEE3F2',
  },
  {
    label: 'Monthly Bookings',
    value: '22',
    icon: 'calendar-month',
    color: '#DEE3F2',
  },
  {
    label: 'Annual Bookings',
    value: '270',
    icon: 'calendar-range',
    color: '#DEE3F2',
  },
];

const reservations = [
  {
    id: '1',
    name: 'John Doe',
    checkIn: '2025-06-14',
    checkOut: '2025-06-16',
    room: 'Room 201',
    status: 'Confirmed',
  },
  {
    id: '2',
    name: 'Jane Smith',
    checkIn: '2025-06-15',
    checkOut: '2025-06-17',
    room: 'Room 104',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Carlos Mendoza',
    checkIn: '2025-06-13',
    checkOut: '2025-06-14',
    room: 'Room 305',
    status: 'Cancelled',
  },
];
const statusColors: Record<string, string> = {
  Reserved: '#d0e7ff',
  Cancelled: '#ffd6d6',
  'Checked-in': '#d6f5d6',
  'Checked-out': '#ffe8c7',
  Pending: '#e1e1e1',
  Confirmed: '#d0e7ff',
  Paid: '#d6f5d6',
  Refunded: '#ffd6d6',
};

const transactions = [
  {
    id: 'T001',
    guest: 'John Doe',
    amount: '₱2,500',
    date: '2025-06-14',
    status: 'Paid',
  },
  {
    id: 'T002',
    guest: 'Jane Smith',
    amount: '₱3,200',
    date: '2025-06-13',
    status: 'Pending',
  },
  {
    id: 'T003',
    guest: 'Carlos Mendoza',
    amount: '₱1,500',
    date: '2025-06-12',
    status: 'Refunded',
  },
];

const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        {dashboardOverview.map((card, index) => (
          <CardContainer
            elevation={2}
            key={index}
            style={[styles.card, { backgroundColor: card.color }]}
          >
            <View style={styles.cardIconRow}>
              <MaterialCommunityIcons name={card.icon} size={24} color="#333" />
              <Text style={styles.cardLabel}>{card.label}</Text>
            </View>
            <Text style={styles.cardValue}>{card.value}</Text>
          </CardContainer>
        ))}
      </View>

      <ThemedText darkColor="#000" type="subtitle" style={styles.sectionTitle}>
        Upcoming Reservations
      </ThemedText>

      <View style={guestTableStyles.tableContainer}>
        <View style={guestTableStyles.tableHeader}>
          <Text style={guestTableStyles.headerCell}>Guest</Text>
          <Text style={guestTableStyles.headerCell}>Check-in</Text>
          <Text style={guestTableStyles.headerCell}>Check-out</Text>
          <Text style={guestTableStyles.headerCell}>Room</Text>
          <Text style={guestTableStyles.headerCell}>Status</Text>
        </View>

        {reservations.map((res, index) => (
          <View
            key={res.id}
            style={[
              guestTableStyles.row,
              index % 2 !== 0 && guestTableStyles.oddRow,
            ]}
          >
            <Text style={guestTableStyles.cell}>{res.name}</Text>
            <Text style={guestTableStyles.cell}>{res.checkIn}</Text>
            <Text style={guestTableStyles.cell}>{res.checkOut}</Text>
            <Text style={guestTableStyles.cell}>{res.room}</Text>
            <View style={[guestTableStyles.cell, { alignItems: 'center' }]}>
              <View
                style={[
                  guestTableStyles.statusBadge,
                  {
                    backgroundColor: statusColors[res.status] || '#ccc',
                  },
                ]}
              >
                <ThemedText style={guestTableStyles.statusText}>
                  {res.status}
                </ThemedText>
              </View>
            </View>
          </View>
        ))}
      </View>

      <ThemedText darkColor="#000" type="subtitle" style={styles.sectionTitle}>
        Recent Transactions
      </ThemedText>

      <View style={guestTableStyles.tableContainer}>
        <View style={guestTableStyles.tableHeader}>
          <Text style={guestTableStyles.headerCell}>Transaction ID</Text>
          <Text style={guestTableStyles.headerCell}>Guest</Text>
          <Text style={guestTableStyles.headerCell}>Amount</Text>
          <Text style={guestTableStyles.headerCell}>Date</Text>
          <Text style={guestTableStyles.headerCell}>Status</Text>
        </View>

        {transactions.map((tx, index) => (
          <View
            key={tx.id}
            style={[
              guestTableStyles.row,
              index % 2 !== 0 && guestTableStyles.oddRow,
            ]}
          >
            <Text style={guestTableStyles.cell}>{tx.id}</Text>
            <Text style={guestTableStyles.cell}>{tx.guest}</Text>
            <Text style={guestTableStyles.cell}>{tx.amount}</Text>
            <Text style={guestTableStyles.cell}>{tx.date}</Text>
            <View style={[guestTableStyles.cell, { alignItems: 'center' }]}>
              <View
                style={[
                  guestTableStyles.statusBadge,
                  { backgroundColor: statusColors[tx.status] || '#ccc' },
                ]}
              >
                <ThemedText style={guestTableStyles.statusText}>
                  {tx.status}
                </ThemedText>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  card: {
    width: '24%', // 4 cards per row with space for gaps
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
  },
  cardLabel: {
    fontSize: 14,
    color: '#000',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 10,
  },
  tableCol: {
    flex: 1,
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  cardIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
});

const guestTableStyles = StyleSheet.create({
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0A1B47',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  oddRow: {
    backgroundColor: '#f8f8f8',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#0A1B47',
  },
});
export default Dashboard;
