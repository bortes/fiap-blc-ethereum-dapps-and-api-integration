import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { blockUI, unblockUI } from '../actions/BlockerAction';
import NewUser from './NewUser';
import OwnerUser from './OwnerUser';
import WadaagService from '../services/WadaagService';

/**
 * Componente responsavel por exibir a pagina principal.
 *
 * @author bortes
 */
function Wadaag(props) {
    const [ready, setReady] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(blockUI('carregando dados...'));

        WadaagService.isOwner()
            .then(data => {
                setIsOwner(data);
            })
            .finally(() => {
                setReady(true)
                dispatch(unblockUI());
            });
        }, []);

    if (!ready) {
        return (
            <div>
            </div>
        );
    }

    return (
        <div>
            {isOwner ? <OwnerUser /> : <NewUser />}
        </div>
    );
}

export default Wadaag;