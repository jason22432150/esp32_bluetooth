
// mobile/src/theme/styles.ts
import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { radii, spacing } from './spacing';
import { typography } from './typography';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textSecondary,
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
  },
  hint: {
    color: colors.textHint,
  },
  deviceRow: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  deviceName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  deviceId: {
    color: colors.textHint,
    marginTop: spacing.xs,
  },
  buttonGrid: {
    gap: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  /** 橫列中的 input，佔滿剩餘寬度 */
  inputFlex: {
    flex: 1,
  },
  /** LED 顏色預覽色塊（動態 backgroundColor 另以 inline 覆寫） */
  colorPreview: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  logText: {
    ...typography.log,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});