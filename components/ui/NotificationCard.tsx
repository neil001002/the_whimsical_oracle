import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, X, Info, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MysticalCard } from './MysticalCard';

interface NotificationCardProps {
  type: 'info' | 'warning' | 'success' | 'mystical';
  title: string;
  message: string;
  onDismiss?: () => void;
  onAction?: () => void;
  actionText?: string;
}

export function NotificationCard({
  type,
  title,
  message,
  onDismiss,
  onAction,
  actionText,
}: NotificationCardProps) {
  const { colors, fonts } = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info color={colors.info} size={20} />;
      case 'warning':
        return <AlertTriangle color={colors.warning} size={20} />;
      case 'success':
        return <CheckCircle color={colors.success} size={20} />;
      case 'mystical':
        return <Bell color={colors.accent} size={20} />;
      default:
        return <Info color={colors.info} size={20} />;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'info':
        return colors.info;
      case 'warning':
        return colors.warning;
      case 'success':
        return colors.success;
      case 'mystical':
        return colors.accent;
      default:
        return colors.info;
    }
  };

  return (
    <MysticalCard style={[styles.container, { borderLeftColor: getAccentColor() }]}>
      <View style={styles.header}>
        <View style={styles.iconTitle}>
          {getIcon()}
          <Text style={[styles.title, { color: colors.text, fontFamily: fonts.body }]}>
            {title}
          </Text>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <X color={colors.textSecondary} size={16} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.message, { color: colors.textSecondary, fontFamily: fonts.body }]}>
        {message}
      </Text>
      
      {onAction && actionText && (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.actionButton, { borderColor: getAccentColor() }]}
        >
          <Text style={[styles.actionText, { color: getAccentColor(), fontFamily: fonts.body }]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </MysticalCard>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 4,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dismissButton: {
    padding: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});