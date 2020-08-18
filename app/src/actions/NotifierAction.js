export const NOTIFY_SUCCESS_ACTION = 'NOTIFY_SUCCESS';
export const NOTIFY_ERROR_ACTION = 'NOTIFY_ERROR';
export const NOTIFY_WARNING_ACTION = 'NOTIFY_WARNING';
export const NOTIFY_INFO_ACTION = 'NOTIFY_INFO';
export const UNNOTIFY_ACTION = 'UNNOTIFY';

export const notifySuccess = (title, message) => ({
    type: NOTIFY_SUCCESS_ACTION,
    notified: true,
    variant: 'success',
    title,
    message,
});

export const notifyError = (title, message) => ({
    type: NOTIFY_ERROR_ACTION,
    notified: true,
    variant: 'danger',
    title,
    message,
});

export const notifyWarning = (title, message) => ({
    type: NOTIFY_WARNING_ACTION,
    notified: true,
    variant: 'warning',
    title,
    message,
});

export const notifyInfo = (title, message) => ({
    type: NOTIFY_INFO_ACTION,
    notified: true,
    variant: 'secondary',
    title,
    message,
});

export const unnotify = () => ({
    type: UNNOTIFY_ACTION,
    notified: false,
    variant: '',
    title: '',
    message: '',
});
