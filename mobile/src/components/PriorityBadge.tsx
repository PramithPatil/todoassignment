import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge: React.FC<
  PriorityBadgeProps
> = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case 'High':
        return {
          backgroundColor: 'rgba(220, 53, 69, 0.10)',
          textColor: colors.priorityHigh,
          dotColor: colors.priorityHigh,
        };

      case 'Medium':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          textColor: colors.priorityMedium,
          dotColor: colors.priorityMedium,
        };

      case 'Low':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.10)',
          textColor: colors.priorityLow,
          dotColor: colors.priorityLow,
        };

      default:
        return {
          backgroundColor: colors.background,
          textColor: colors.textSecondary,
          dotColor: colors.textLight,
        };
    }
  };

  const badge = getStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor:
            badge.backgroundColor,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: badge.dotColor,
          },
        ]}
      />

      <Text
        style={[
          styles.text,
          {
            color: badge.textColor,
          },
        ]}
      >
        {priority}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 7,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  text: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});

export default PriorityBadge;