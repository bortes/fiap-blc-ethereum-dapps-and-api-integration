import { NOTIFY_SUCCESS_ACTION, NOTIFY_ERROR_ACTION, NOTIFY_WARNING_ACTION, NOTIFY_INFO_ACTION, UNNOTIFY_ACTION } from '../actions/NotifierAction';

const initialState = {
    notified: false,
    variant: '',
    title: '',
    message: '',
};

/**
 * Atualiza o estado da aplicacao em funcao das acoes solicitadas.
 *
 * @author bortes
 */
export const NotifierReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFY_SUCCESS_ACTION:
            return {
                ...state,
                notified: action.notified,
                variant: action.variant,
                title: action.title,
                message: action.message,
            }

        case NOTIFY_ERROR_ACTION:
            return {
                ...state,
                notified: action.notified,
                variant: action.variant,
                title: action.title,
                message: action.message,
            }

        case NOTIFY_WARNING_ACTION:
            return {
                ...state,
                notified: action.notified,
                variant: action.variant,
                title: action.title,
                message: action.message,
            }

        case NOTIFY_INFO_ACTION:
            return {
                ...state,
                notified: action.notified,
                variant: action.variant,
                title: action.title,
                message: action.message,
            }

        case UNNOTIFY_ACTION:
            return {
                ...state,
                notified: action.notified,
                variant: action.variant,
                title: action.title,
                message: action.message,
            }

        default:
            return state;
    }
};