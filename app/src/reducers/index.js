import { combineReducers } from 'redux';

import { BlockerReducer } from './BlockerReducer';
import { WadaagReducer } from './WadaagReducer';

export const Reducers = combineReducers({
    blockerState: BlockerReducer,
    wadaagState: WadaagReducer
});