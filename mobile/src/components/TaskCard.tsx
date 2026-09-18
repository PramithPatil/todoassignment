import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  format,
  isPast,
  isToday,
  parseISO,
} from 'date-fns';

import { Task } from '../types';
import { colors } from '../theme/colors';
import PriorityBadge from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggle,
  onDelete,
}) => {
  const isCompleted = task.status === 'completed';

  const dueDate = parseISO(task.dueDateTime);

  const isOverdue =
    !isCompleted && isPast(dueDate);

  const dateLabel = isToday(dueDate)
    ? `Today, ${format(dueDate, 'h:mm a')}`
    : format(dueDate, 'MMM dd, yyyy · h:mm a');

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.card,
        isCompleted && styles.completedCard,
        isOverdue && styles.overdueCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        {/* Checkbox */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.checkbox,
            isCompleted && styles.checkboxCompleted,
          ]}
          onPress={onToggle}
        >
          <MaterialCommunityIcons
            name={
              isCompleted
                ? 'check'
                : 'checkbox-blank-outline'
            }
            size={isCompleted ? 17 : 20}
            color={
              isCompleted
                ? colors.white
                : colors.textLight
            }
          />
        </TouchableOpacity>

        {/* Main content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                isCompleted &&
                  styles.completedTitle,
              ]}
            >
              {task.title}
            </Text>

            <PriorityBadge
              priority={task.priority}
            />
          </View>

          {task.description ? (
            <Text
              numberOfLines={2}
              style={[
                styles.description,
                isCompleted &&
                  styles.completedDescription,
              ]}
            >
              {task.description}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons
                name={
                  isOverdue
                    ? 'clock-alert-outline'
                    : 'calendar-outline'
                }
                size={15}
                color={
                  isOverdue
                    ? colors.overdue
                    : colors.textLight
                }
              />

              <Text
                style={[
                  styles.date,
                  isOverdue &&
                    styles.overdueText,
                ]}
              >
                {isOverdue
                  ? `Overdue · ${dateLabel}`
                  : dateLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Delete */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={19}
            color={colors.textLight}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 17,
    padding: 15,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  completedCard: {
    opacity: 0.65,
  },

  overdueCard: {
    borderLeftColor: colors.overdue,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    marginTop: 1,
  },

  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  title: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },

  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },

  description: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 9,
  },

  completedDescription: {
    color: colors.textLight,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  date: {
    fontSize: 11,
    color: colors.textLight,
    marginLeft: 5,
  },

  overdueText: {
    color: colors.overdue,
    fontWeight: '700',
  },

  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
});

export default TaskCard;