import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity key={i} onPress={() => onPageChange(i)}>
          <ThemedText
            style={[
              styles.pageNumber,
              currentPage === i && styles.activePageNumber,
            ]}
          >
            {i}
          </ThemedText>
        </TouchableOpacity>
      );
    }
    return pages;
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={styles.paginationButton}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ThemedText style={styles.paginationButtonText}>
          {'<'} Previous
        </ThemedText>
      </TouchableOpacity>
      <View style={styles.pageNumbers}>{renderPageNumbers()}</View>
      <TouchableOpacity
        style={styles.paginationButton}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ThemedText style={styles.paginationButtonText}>Next {'>'}</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  paginationButtonText: {
    color: '#333',
    fontSize: 14,
  },
  pageNumbers: {
    flexDirection: 'row',
  },
  pageNumber: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 5,
    color: '#333',
    fontSize: 14,
  },
  activePageNumber: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
});

export default Pagination;
