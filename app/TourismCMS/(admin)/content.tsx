import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const ContentManagement = () => {
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <ThemedText darkColor="#000" type="title">
        Content Management
      </ThemedText>
      <ThemedText darkColor="#666" type="default">
        Manage website content, articles, and media assets
      </ThemedText>

      <View style={styles.content}>
        <ThemedText darkColor="#000" type="subtitle">
          Features Coming Soon...
        </ThemedText>
        <ThemedText darkColor="#666" type="default">
          • Manage website content{'\n'}• Create and edit articles{'\n'}• Upload
          and organize media{'\n'}• Content publishing workflow{'\n'}• SEO
          optimization tools
        </ThemedText>

        {profile?.role === 'tourism_admin' && (
          <View style={styles.adminSection}>
            <ThemedText darkColor="#007AFF" type="subtitle">
              Admin Features
            </ThemedText>
            <ThemedText darkColor="#666" type="default">
              • Content approval system{'\n'}• Media library management{'\n'}•
              Content analytics
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  content: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adminSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
});

export default ContentManagement;
