import { BLOCK_UI_ACTION, UNBLOCK_UI_ACTION } from '../actions/BlockerAction';

const initialState = {
    blocked: false,
    blockMessage: ''
};

/**
 * Atualiza o estado da aplicacao em funcao das acoes solicitadas.
 *
 * @author bortes
 */
export const BlockerReducer = (state = initialState, action) => {
    switch (action.type) {
        case BLOCK_UI_ACTION:
            return {
                ...state,
                blocked: action.blocked,
                blockMessage: action.blockMessage
            };

        case UNBLOCK_UI_ACTION:
            return {
                ...state,
                blocked: action.blocked,
                blockMessage: action.blockMessage
            };

        default:
            return state;
    }
};