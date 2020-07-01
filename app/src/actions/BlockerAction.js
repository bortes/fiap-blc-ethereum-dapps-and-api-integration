export const BLOCK_UI_ACTION = 'BLOCK_UI';
export const UNBLOCK_UI_ACTION = 'UNBLOCK_UI';

export const blockUI = (message) => ({
    type: BLOCK_UI_ACTION,
    blocked: true,
    blockMessage: message
});

export const unblockUI = () => ({
    type: UNBLOCK_UI_ACTION,
    blocked: false,
    blockMessage: ''
});