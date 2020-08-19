export const NOTIFY_SUCCESS_ACTION = 'NOTIFY_SUCCESS';
export const NOTIFY_ERROR_ACTION = 'NOTIFY_ERROR';
export const NOTIFY_WARNING_ACTION = 'NOTIFY_WARNING';
export const NOTIFY_INFO_ACTION = 'NOTIFY_INFO';
export const UNNOTIFY_ACTION = 'UNNOTIFY';

export const notifySuccess = (title, detail) => ({
    type: NOTIFY_SUCCESS_ACTION,
    notified: true,
    variant: 'success',
    title,
    detail,
});

export const notifyError = (title, detail) => ({
    type: NOTIFY_ERROR_ACTION,
    notified: true,
    variant: 'danger',
    title,
    detail,
});

export const notifyWarning = (title, detail) => ({
    type: NOTIFY_WARNING_ACTION,
    notified: true,
    variant: 'warning',
    title,
    detail,
});

export const notifyInfo = (title, detail) => ({
    type: NOTIFY_INFO_ACTION,
    notified: true,
    variant: 'secondary',
    title,
    detail,
});

export const unnotify = () => ({
    type: UNNOTIFY_ACTION,
    notified: false,
    variant: '',
    title: '',
    detail: '',
});
