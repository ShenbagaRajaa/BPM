export interface SnackbarState {
  message: string;
  actionLabel?: string;
  duration: number;
  status: 'success' | 'error' | 'info';
  show: boolean;
}

export const initialState: SnackbarState = {
  message: '',
  actionLabel: 'Close',
  duration: 5000,
  status: 'info',
  show: false,
};
