import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

const transactionRecords = [
  {
    id: 'TXN-0001',
    guestName: 'Alexander Cruz',
    modeOfPayment: 'GCash',
    amountPaid: 2000,
    paymentType: 'Partial',
    date: '2025-06-06 10:45 AM',
  },
  {
    id: 'TXN-0002',
    guestName: 'Maria Santos',
    modeOfPayment: 'Cash',
    amountPaid: 5000,
    paymentType: 'Full',
    date: '2025-06-05 02:30 PM',
  },
  {
    id: 'TXN-0003',
    guestName: 'Juan Dela Cruz',
    modeOfPayment: 'Credit Card',
    amountPaid: 3000,
    paymentType: 'Full',
    date: '2025-06-01 09:00 AM',
  },
  {
    id: 'TXN-0004',
    guestName: 'Angel David',
    modeOfPayment: 'GCash',
    amountPaid: 1000,
    paymentType: 'Partial',
    date: '2025-06-01 03:20 PM',
  },
  {
    id: 'TXN-0005',
    guestName: 'Patrick Villanueva',
    modeOfPayment: 'Bank Transfer',
    amountPaid: 2500,
    paymentType: 'Full',
    date: '2025-05-30 01:00 PM',
  },
];

const TransactionRecords = () => {
  const [search, setSearch] = useState('');
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactionRecords);

  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    if (!search.trim()) {
      setFilteredTransactions(transactionRecords);
    } else {
      const filtered = transactionRecords.filter(
        (tx) =>
          tx.guestName.toLowerCase().includes(search.toLowerCase()) ||
          tx.id.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [search]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ padding: 16 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by guest name or transaction ID..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Txn ID</Text>
          <Text style={styles.headerCell}>Guest</Text>
          <Text style={styles.headerCell}>Mode</Text>
          <Text style={styles.headerCell}>Amount</Text>
          <Text style={styles.headerCell}>Type</Text>
          <Text style={styles.headerCell}>Date</Text>
        </View>

        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={[styles.row, index % 2 !== 0 && styles.oddRow]}>
              <Text style={styles.cell}>{item.id}</Text>
              <Text style={styles.cell}>{item.guestName}</Text>
              <Text style={styles.cell}>{item.modeOfPayment}</Text>
              <Text style={styles.cell}>₱{item.amountPaid}</Text>
              <Text style={styles.cell}>{item.paymentType}</Text>
              <Text style={styles.cell}>{item.date}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default TransactionRecords;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginBottom: 12,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0A1B47',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-Regular',
  },
});
