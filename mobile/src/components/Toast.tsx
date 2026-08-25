import { Toast, type ToastRootProps } from '@tamagui/toast/v2';

export { Toast };

type CustomToastProps = ToastRootProps & {
  /** Title 文案，預設「提示」 */
  title?: string;
  /** Description 文案，預設「提示文案」 */
  description?: string;
};

export function CustomToast() {
  return (
    <Toast position="top-right">
      <Toast.Viewport>
        <Toast.List
          renderItem={({ toast: t, index }) => (
            <Toast.Item key={t.id} toast={t} index={index}>
              <Toast.Title>{t.title}</Toast.Title>
              <Toast.Description>{t.description}</Toast.Description>
              <Toast.Close />
            </Toast.Item>
          )}
        />
      </Toast.Viewport>
    </Toast>
  );
};
