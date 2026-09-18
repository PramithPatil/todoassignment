import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/store';
import { createTask, updateTask } from '../store/slices/taskSlice';
import { TaskFormData, Priority } from '../types';
import { taskSchema } from '../utils/validationSchemas';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AddEditTask'
>;

type RouteProps = RouteProp<AppStackParamList, 'AddEditTask'>;

const AddEditTaskScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const dispatch = useAppDispatch();

  const taskId = route.params?.taskId;

  const { tasks } = useAppSelector((state) => state.tasks);

  const existingTask = taskId
    ? tasks.find((task) => task._id === taskId)
    : null;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: existingTask?.title || '',
      description: existingTask?.description || '',
      dueDateTime: existingTask
        ? new Date(existingTask.dueDateTime)
        : new Date(),
      priority: existingTask?.priority || 'Medium',
    },
  });

  useEffect(() => {
    if (existingTask) {
      reset({
        title: existingTask.title,
        description: existingTask.description,
        dueDateTime: new Date(existingTask.dueDateTime),
        priority: existingTask.priority,
      });
    }
  }, [existingTask, reset]);

  const dueDateTime = watch('dueDateTime');
  const priority = watch('priority');

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (taskId) {
        await dispatch(
          updateTask({
            id: taskId,
            data,
          }),
        ).unwrap();
      } else {
        await dispatch(createTask(data)).unwrap();
      }

      navigation.goBack();
    } catch (error: any) {
      setSubmitError(error || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDate = (date: Date) => {
    setValue('dueDateTime', date, {
      shouldValidate: true,
    });

    setDatePickerVisibility(false);
  };

  const getPriorityColor = (p: Priority) => {
    if (p === 'High') {
      return colors.priorityHigh;
    }

    if (p === 'Medium') {
      return colors.priorityMedium;
    }

    return colors.priorityLow;
  };

  const renderPriorityOptions = () => {
    const priorities: Priority[] = ['Low', 'Medium', 'High'];

    return (
      <View style={styles.prioritySection}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Priority</Text>
            <Text style={styles.sectionSubtitle}>
              Set the importance of this task
            </Text>
          </View>
        </View>

        <View style={styles.priorityRow}>
          {priorities.map((item) => {
            const selected = priority === item;
            const priorityColor = getPriorityColor(item);

            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                style={[
                  styles.priorityOption,
                  selected && {
                    borderColor: priorityColor,
                    backgroundColor: `${priorityColor}12`,
                  },
                ]}
                onPress={() =>
                  setValue('priority', item, {
                    shouldValidate: true,
                  })
                }
              >
                <View
                  style={[
                    styles.priorityDot,
                    {
                      backgroundColor: priorityColor,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.priorityText,
                    selected && {
                      color: priorityColor,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {item}
                </Text>

                {selected && (
                  <MaterialCommunityIcons
                    name="check"
                    size={17}
                    color={priorityColor}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {errors.priority && (
          <Text style={styles.errorText}>
            {errors.priority.message}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.eyebrow}>
              {taskId ? 'EDIT TASK' : 'NEW TASK'}
            </Text>

            <Text style={styles.title}>
              {taskId ? 'Edit task' : 'Create a task'}
            </Text>

            <Text style={styles.subtitle}>
              {taskId
                ? 'Update the details of your task.'
                : 'Add the details you need to stay organized.'}
            </Text>
          </View>
        </View>

        {/* Error */}
        {submitError && (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color={colors.error}
            />

            <Text style={styles.errorBannerText}>
              {submitError}
            </Text>
          </View>
        )}

        {/* Task details */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Task details</Text>
              <Text style={styles.sectionSubtitle}>
                Give your task a clear title and description
              </Text>
            </View>
          </View>

          <CustomInput
            name="title"
            control={control}
            label="Title"
            placeholder="e.g. Complete project documentation"
          />

          <View style={styles.descriptionSpacing}>
            <CustomInput
              name="description"
              control={control}
              label="Description"
              placeholder="Add additional details (optional)"
              multiline
            />
          </View>
        </View>

        {/* Due date */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Due date & time</Text>
              <Text style={styles.sectionSubtitle}>
                Choose when this task should be completed
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dateButton}
            onPress={() => setDatePickerVisibility(true)}
          >
            <View style={styles.dateIconContainer}>
              <MaterialCommunityIcons
                name="calendar-clock-outline"
                size={23}
                color={colors.primary}
              />
            </View>

            <View style={styles.dateContent}>
              <Text style={styles.dateLabel}>Deadline</Text>

              <Text style={styles.dateText}>
                {format(dueDateTime, 'EEE, MMM dd, yyyy')}
              </Text>

              <Text style={styles.timeText}>
                {format(dueDateTime, 'h:mm a')}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {errors.dueDateTime && (
            <Text style={styles.errorText}>
              {errors.dueDateTime.message}
            </Text>
          )}
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          date={dueDateTime}
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
        />

        {/* Priority */}
        <View style={styles.formCard}>
          {renderPriorityOptions()}
        </View>

        {/* Submit */}
        <CustomButton
          title={taskId ? 'Update Task' : 'Create Task'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.submitButton}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  headerTextContainer: {
    flex: 1,
    paddingTop: 1,
  },

  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#F3CACA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },

  errorBannerText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 13,
    lineHeight: 18,
    color: colors.error,
  },

  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 14,
  },

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },

  descriptionSpacing: {
    marginTop: 3,
  },

  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 76,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 13,
    backgroundColor: colors.background,
  },

  dateIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}12`,
    marginRight: 12,
  },

  dateContent: {
    flex: 1,
  },

  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 3,
  },

  dateText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },

  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  prioritySection: {
    width: '100%',
  },

  priorityRow: {
    gap: 8,
  },

  priorityOption: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },

  priorityText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 7,
  },

  submitButton: {
    marginTop: 4,
  },

  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    marginTop: 8,
  },

  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default AddEditTaskScreen;