import { ShopColors } from '@/constants/ShopColors';
import type { ShopBusinessHours } from '@/types/shop';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ShopDetailBusinessHoursProps {
  businessHours: ShopBusinessHours;
  currentDay?: string;
}

const ShopDetailBusinessHours: React.FC<ShopDetailBusinessHoursProps> = ({ 
  businessHours, 
  currentDay 
}) => {
  const getCurrentDay = () => {
    if (currentDay) return currentDay.toLowerCase();
    return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  };

  const todayKey = getCurrentDay() as keyof ShopBusinessHours;

  const formatTime = (time: string) => {
    try {
      // Convert 24-hour format to 12-hour format
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <View style={styles.businessHours}>
      {dayOrder.map((day) => {
        const dayKey = day as keyof ShopBusinessHours;
        const hours = businessHours[dayKey];
        const isToday = dayKey === todayKey;
        
        if (!hours) return null;

        return (
          <View 
            key={day} 
            style={[
              styles.businessHourRow,
              isToday && styles.todayRow
            ]}
          >
            <Text style={[
              styles.businessHourDay,
              isToday && styles.todayText
            ]}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
              {isToday && ' (Today)'}
            </Text>
            <Text style={[
              styles.businessHourTime,
              isToday && styles.todayTime,
              hours.isClosed && styles.closedTime
            ]}>
              {hours.isClosed 
                ? 'Closed' 
                : `${formatTime(hours.open)} - ${formatTime(hours.close)}`
              }
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  businessHours: {
    paddingHorizontal: 20,
  },
  businessHourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  todayRow: {
    backgroundColor: ShopColors.accent + '08',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderBottomColor: 'transparent',
  },
  businessHourDay: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textPrimary,
    flex: 1,
  },
  businessHourTime: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  todayText: {
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.accent,
  },
  todayTime: {
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
  },
  closedTime: {
    color: ShopColors.error,
    fontStyle: 'italic',
  },
});

export default React.memo(ShopDetailBusinessHours);