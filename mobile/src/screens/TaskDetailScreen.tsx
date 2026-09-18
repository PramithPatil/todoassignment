import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, isPast, parseISO } from 'date-fns';
import { AppStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/store';
import { toggleTask, deleteTask } from '../store/slices/taskSlice';
import PriorityBadge from '../components/PriorityBadge';
import CustomButton from '../components/CustomButton';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'TaskDetail'>;
type RouteProps = RouteProp<AppStackParamList, 'TaskDetail'>;

const TaskDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const dispatch = useAppDispatch();
  const { taskId } = route.params;

  const task = useAppSelector((state) => state.tasks.tasks.find(t => t._id === taskId));

  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Task not found.</Text>
      </View>
    );
  }

  const isCompleted = task.status === 'completed';
  const isOverdue = !isCompleted && isPast(parseISO(task.dueDateTime));

  const handleToggle = () => {
    dispatch(toggleTask(taskId));
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          dispatch(deleteTask(taskId));
          navigation.goBack();
        }
      },
    ]);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddEditTask', { taskId })} style={{ padding: 8 }}>
          <MaterialCommunityIcons name="pencil" size={24} color={colors.white} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, taskId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>{task.title}</Text>
        <PriorityBadge priority={task.priority} />
      </View>

      {isOverdue && (
        <View style={styles.overdueBanner}>
          <MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.error} />
          <Text style={styles.overdueText}>This task is overdue!</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          <MaterialCommunityIcons 
            name={isCompleted ? 'check-circle' : 'clock-outline'} 
            size={20} 
            color={isCompleted ? colors.success : colors.warning} 
          />
          <Text style={styles.value}>
            {isCompleted ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Due Date</Text>
        <Text style={[styles.value, isOverdue && styles.overdueValue]}>
          {format(parseISO(task.dueDateTime), 'EEEE, MMMM do yyyy, h:mm a')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.description}>
          {task.description || 'No description provided.'}
        </Text>
      </View>

      <View style={styles.actions}>
        <CustomButton
          title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
          onPress={handleToggle}
          variant="primary"
          style={styles.actionBtn}
        />
        <CustomButton
          title="Delete Task"
          onPress={handleDelete}
          variant="danger"
          style={styles.actionBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  overdueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.error,
  },
  overdueText: {
    color: colors.error,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  overdueValue: {
    color: colors.error,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  actions: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  actionBtn: {
    marginBottom: 12,
  },
});

export default TaskDetailScreen;
