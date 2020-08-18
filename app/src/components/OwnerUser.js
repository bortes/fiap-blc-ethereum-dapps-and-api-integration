import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { blockUI, unblockUI } from '../actions/BlockerAction';
import WadaagService from '../services/WadaagService';

/**
 * Componente responsavel por exibir a pagina para usuarios ja registrados.
 *
 * @author bortes
 */
function OwnerUser(props) {
    const [ready, setReady] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(blockUI('carregando dados...'));

        WadaagService.isOwner()
            .then(data => {
                setReady(true)
            })
            .finally(() => {
                setReady(true)
                dispatch(unblockUI());
            });
        }, []);

    if (!ready) {
        return (<div></div>);
    }

    return (
        <div>
            OwnerUser
        </div>
    );
}

export default OwnerUser;