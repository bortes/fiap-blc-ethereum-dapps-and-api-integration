import { combineReducers } from 'redux';

import { BlockerReducer } from './BlockerReducer';
import { NotifierReducer } from './NotifierReducer';
import { WadaagReducer } from './WadaagReducer';

export const Reducers = combineReducers({
    blockerState: BlockerReducer,
    notifierState: NotifierReducer,
    wadaagState: WadaagReducer
});