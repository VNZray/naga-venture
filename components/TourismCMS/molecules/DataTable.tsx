// filepath: components/TourismCMS/molecules/DataTable.tsx
import React, { memo } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * DataTable - Molecule Component
 *
 * A generic, reusable table component that displays data in rows and columns.
 * Optimized for web and mobile platforms with responsive design.
 * Following atomic design principles as a molecule.
 */

export interface DataTableColumn<T = any> {
  key: string;
  title: string;
  width?: number | string;
  minWidth?: number;
  sortable?: boolean;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowPress?: (item: T, index: number) => void;
  showRowIndex?: boolean;
  maxHeight?: number;
  style?: any;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowPress,
  showRowIndex = false,
  maxHeight,
  style,
}: DataTableProps<T>) => {
  const renderHeader = () => (
    <View style={styles.headerRow}>
      {showRowIndex && (
        <View style={[styles.headerCell, styles.indexCell]}>
          <Text style={styles.headerText}>#</Text>
        </View>
      )}
      {columns.map((column, index) => (
        <View
          key={column.key}
          style={[
            styles.headerCell,
            {
              width: column.width,
              minWidth: column.minWidth || 100,
              alignItems:
                column.align === 'center'
                  ? 'center'
                  : column.align === 'right'
                  ? 'flex-end'
                  : 'flex-start',
            },
            index === columns.length - 1 && styles.lastColumn,
          ]}
        >
          <Text style={styles.headerText} numberOfLines={2}>
            {column.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderRow = (item: T, rowIndex: number) => {
    const RowComponent = onRowPress ? TouchableOpacity : View;

    return (
      <RowComponent
        key={rowIndex}
        style={[
          styles.dataRow,
          rowIndex % 2 === 1 && styles.alternateRow,
          onRowPress && styles.pressableRow,
        ]}
        onPress={onRowPress ? () => onRowPress(item, rowIndex) : undefined}
        disabled={!onRowPress}
        activeOpacity={onRowPress ? 0.7 : 1}
      >
        {showRowIndex && (
          <View style={[styles.dataCell, styles.indexCell]}>
            <Text style={styles.indexText}>{rowIndex + 1}</Text>
          </View>
        )}
        {columns.map((column, colIndex) => (
          <View
            key={column.key}
            style={[
              styles.dataCell,
              {
                width: column.width,
                minWidth: column.minWidth || 100,
                alignItems:
                  column.align === 'center'
                    ? 'center'
                    : column.align === 'right'
                    ? 'flex-end'
                    : 'flex-start',
              },
              colIndex === columns.length - 1 && styles.lastColumn,
            ]}
          >
            {column.render ? (
              column.render(item[column.key], item, rowIndex)
            ) : (
              <Text
                style={[styles.cellText, { textAlign: column.align || 'left' }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item[column.key]?.toString() || '-'}
              </Text>
            )}
          </View>
        ))}
      </RowComponent>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0A1B47" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      <ScrollView
        style={[styles.scrollContainer, maxHeight ? { maxHeight } : null]}
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        {isLoading
          ? renderLoadingState()
          : data.length === 0
          ? renderEmptyState()
          : data.map((item, index) => renderRow(item, index))}
      </ScrollView>
    </View>
  );
};

// Export as memoized component for performance
export default memo(DataTable) as typeof DataTable;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },

  // Header styles
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    minHeight: 48,
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Data row styles
  scrollContainer: {
    flex: 1,
  },
  dataRow: {
    flexDirection: 'row',
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  alternateRow: {
    backgroundColor: '#FAFAFA',
  },
  pressableRow: {
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  dataCell: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  cellText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  // Index column styles
  indexCell: {
    flex: 0,
    width: 50,
    minWidth: 50,
    alignItems: 'center',
  },
  indexText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Remove border from last column
  lastColumn: {
    borderRightWidth: 0,
  },

  // State styles
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});
