// filepath: components/TourismCMS/molecules/CMSHeader.tsx
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CMSText } from '../atoms';

export interface CMSHeaderProps {
  title: string;
  userName: string;
  userEmail: string;
  onNotificationPress?: () => void;
  onUserPress?: () => void;
}

/**
 * CMS Header Molecule
 *
 * A header component specific to the Tourism CMS admin interface.
 * Contains title, user information, and notification functionality.
 * Following Atomic Design principles as a molecule (combination of atoms).
 *
 * @param title - The header title to display
 * @param userName - The current user's name
 * @param userEmail - The current user's email
 * @param onNotificationPress - Optional callback for notification bell press
 * @param onUserPress - Optional callback for user avatar press
 */
const CMSHeader: React.FC<CMSHeaderProps> = React.memo(
  ({ title, userName, userEmail, onNotificationPress, onUserPress }) => {
    return (
      <View style={styles.headerContainer}>
        
        <View style={styles.headerLeft}>
          <CMSText type="headerTitle" darkColor="#000">
            {title}
          </CMSText>
        </View>
        <View style={styles.headerMiddle} />
        <View style={styles.headerRight}>
          <View style={styles.userSection}>
            <Pressable
              style={styles.notificationContainer}
              onPress={
                onNotificationPress ||
                (() => console.log('Notification pressed'))
              }
              accessibilityLabel="Notifications"
              accessibilityRole="button"
            >
              <FontAwesome name="bell" size={20} color="#000" />
            </Pressable>
            <View style={styles.userDetails}>
              <CMSText type="body" style={styles.userText} darkColor="#000">
                {userName}
              </CMSText>
              <CMSText type="body" style={styles.userText} darkColor="#666">
                {userEmail}
              </CMSText>
            </View>

            <Pressable
              style={styles.userIcon}
              onPress={onUserPress}
              accessibilityLabel="User profile"
              accessibilityRole="button"
            >
              <FontAwesome name="user" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
);

CMSHeader.displayName = 'CMSHeader';

export default CMSHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerLeft: {
    flex: 1,
  },
  headerMiddle: {
    flex: 2,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    marginRight: 12,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    marginRight: 12,
  },
  userText: {
    textAlign: 'right',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

