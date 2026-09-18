import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  fetchTasks,
  toggleTask,
  deleteTask,
  setStatusFilter,
  setPriorityFilter,
} from '../store/slices/taskSlice';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import CustomButton from '../components/CustomButton';
import { getSortedTasks } from '../utils/sortTasks';
import { StatusFilter, PriorityFilter } from '../types';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'TaskList'
>;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TaskListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const {
    tasks,
    isLoading,
    error,
    statusFilter,
    priorityFilter,
  } = useAppSelector((state) => state.tasks);

  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    await dispatch(fetchTasks());
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete task',
      'Are you sure you want to permanently delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            dispatch(deleteTask(id));
          },
        },
      ]
    );
  };

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );
    dispatch(toggleTask(id));
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks;

    if (statusFilter !== 'all') {
      result = result.filter(
        (task) => task.status === statusFilter
      );
    }

    if (priorityFilter !== 'all') {
      result = result.filter(
        (task) => task.priority === priorityFilter
      );
    }

    return getSortedTasks(result);
  }, [tasks, statusFilter, priorityFilter]);

  const pendingCount = tasks.filter(
    (task) => task.status === 'pending'
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === 'completed'
  ).length;

  const totalCount = tasks.length;

  const completionPercentage =
    totalCount === 0
      ? 0
      : Math.round((completedCount / totalCount) * 100);

  const statusFilters: {
    value: StatusFilter;
    label: string;
    icon: string;
  }[] = [
    {
      value: 'all',
      label: 'All',
      icon: 'view-list-outline',
    },
    {
      value: 'pending',
      label: 'Pending',
      icon: 'clock-outline',
    },
    {
      value: 'completed',
      label: 'Completed',
      icon: 'check-circle-outline',
    },
  ];

  const priorityFilters: {
    value: PriorityFilter;
    label: string;
  }[] = [
    {
      value: 'all',
      label: 'All',
    },
    {
      value: 'High',
      label: 'High',
    },
    {
      value: 'Medium',
      label: 'Medium',
    },
    {
      value: 'Low',
      label: 'Low',
    },
  ];

  if (error && tasks.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIcon}>
          <MaterialCommunityIcons
            name="cloud-alert-outline"
            size={34}
            color={colors.error}
          />
        </View>

        <Text style={styles.errorTitle}>
          Unable to load tasks
        </Text>

        <Text style={styles.errorMessage}>
          {error}
        </Text>

        <CustomButton
          title="Try Again"
          onPress={loadData}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAndSortedTasks}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.overline}>
                  TASK MANAGER
                </Text>

                <Text style={styles.title}>
                  My Tasks
                </Text>

                <Text style={styles.subtitle}>
                  {pendingCount === 0
                    ? 'Everything is completed'
                    : `${pendingCount} ${
                        pendingCount === 1
                          ? 'task'
                          : 'tasks'
                      } remaining`}
                </Text>
              </View>

              <View style={styles.headerButton}>
                <MaterialCommunityIcons
                  name="check-all"
                  size={24}
                  color={colors.white}
                />
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.progressLabel}>
                    COMPLETION
                  </Text>

                  <Text style={styles.progressTitle}>
                    {completedCount} of {totalCount} completed
                  </Text>
                </View>

                <Text style={styles.progressPercent}>
                  {completionPercentage}%
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${completionPercentage}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Filters */}
            <View style={styles.filterCard}>
              <Text style={styles.filterHeading}>
                STATUS
              </Text>

              <View style={styles.statusContainer}>
                {statusFilters.map((filter) => {
                  const active =
                    statusFilter === filter.value;

                  return (
                    <TouchableOpacity
                      key={filter.value}
                      activeOpacity={0.8}
                      style={[
                        styles.statusButton,
                        active &&
                          styles.statusButtonActive,
                      ]}
                      onPress={() =>
                        dispatch(
                          setStatusFilter(filter.value)
                        )
                      }
                    >
                      <MaterialCommunityIcons
                        name={filter.icon}
                        size={16}
                        color={
                          active
                            ? colors.white
                            : colors.textSecondary
                        }
                      />

                      <Text
                        style={[
                          styles.statusText,
                          active &&
                            styles.statusTextActive,
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text
                style={[
                  styles.filterHeading,
                  styles.priorityHeading,
                ]}
              >
                PRIORITY
              </Text>

              <View style={styles.priorityContainer}>
                {priorityFilters.map((filter) => {
                  const active =
                    priorityFilter === filter.value;

                  return (
                    <TouchableOpacity
                      key={filter.value}
                      activeOpacity={0.8}
                      style={[
                        styles.priorityButton,
                        active &&
                          styles.priorityButtonActive,
                      ]}
                      onPress={() =>
                        dispatch(
                          setPriorityFilter(filter.value)
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          active &&
                            styles.priorityTextActive,
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  {statusFilter === 'all'
                    ? 'All tasks'
                    : statusFilter === 'pending'
                    ? 'Pending tasks'
                    : 'Completed tasks'}
                </Text>

                <Text style={styles.sectionSubtitle}>
                  {filteredAndSortedTasks.length}{' '}
                  {filteredAndSortedTasks.length === 1
                    ? 'task'
                    : 'tasks'}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="sort-clock-descending-outline"
                size={20}
                color={colors.textLight}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() =>
              navigation.navigate('TaskDetail', {
                taskId: item._id,
              })
            }
            onToggle={() => handleToggle(item._id)}
            onDelete={() =>
              handleDelete(item._id)
            }
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <EmptyState
                icon="clipboard-text-outline"
                title="No tasks found"
                message="Change your filters or create a new task."
              />
            </View>
          ) : null
        }
      />

      {/* Add task */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() =>
          navigation.navigate('AddEditTask')
        }
      >
        <MaterialCommunityIcons
          name="plus"
          size={27}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerText: {
    flex: 1,
  },

  overline: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: 5,
  },

  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.text,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },

  headerButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  progressCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 5,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },

  progressPercent: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginTop: 17,
  },

  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.white,
  },

  filterCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 15,
    marginBottom: 21,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterHeading: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: colors.textLight,
    marginBottom: 9,
  },

  statusContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
  },

  statusButton: {
    flex: 1,
    height: 39,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusButtonActive: {
    backgroundColor: colors.primary,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 5,
  },

  statusTextActive: {
    color: colors.white,
    fontWeight: '700',
  },

  priorityHeading: {
    marginTop: 15,
  },

  priorityContainer: {
    flexDirection: 'row',
    gap: 7,
  },

  priorityButton: {
    flex: 1,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  priorityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  priorityTextActive: {
    color: colors.white,
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  sectionSubtitle: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },

  emptyContainer: {
    minHeight: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },

  errorIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 7,
  },

  errorMessage: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 22,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 22,
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    elevation: 7,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});

export default TaskListScreen;