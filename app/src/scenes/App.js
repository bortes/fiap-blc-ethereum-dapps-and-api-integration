import React, { useEffect, useState } from 'react';
import { 
    Alert, 
    Modal, 
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import UIBlocker from 'react-ui-blocker';

import { blockUI, unblockUI } from '../actions/BlockerAction';
import { unnotify } from '../actions/NotifierAction';
import Wadaag from '../components/Wadaag';
import WadaagService from '../services/WadaagService';

/**
 * Componente responsavel por exibir a pagina principal.
 *
 * @author bortes
 */
function App(props) {
    const [ready, setReady] = useState(false);

    const [isUnavailable, setIsUnavailable] = useState(true);

    const dispatch = useDispatch();
    const blocker = useSelector(state => state.blockerState);
    const notifier = useSelector(state => state.notifierState);

    useEffect(() => {
        dispatch(unnotify())

        dispatch(blockUI('conectando-se a rede...'));

        WadaagService.isReady()
            .then(data => {
                setIsUnavailable(false);
            })
            .finally(() => {
                setReady(true)
                dispatch(unblockUI());
            });
    }, []);

    if (!ready) {
        return null;
    }

    return (
        <main role="main">
            {!isUnavailable && <Wadaag />}

            <Modal show={isUnavailable}>
                <Modal.Header>
                    <Modal.Title as="h3" className="text-danger">
                        Ops!!
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className="h5 mb-5">
                        Não é possível conectar-se à rede blockchain.
                    </p>

                    <p className="h5">
                        Por favor, <span className="text-warning">verifique sua conexão</span> com a rede e tente novamente.
                    </p>
                </Modal.Body>
            </Modal>

            <Modal show={notifier.notified} backdrop={false}>
                <Alert variant={notifier.variant} dismissible className="mb-0" onClose={() => dispatch(unnotify())}>
                    <Alert.Heading>{notifier.title}</Alert.Heading>

                    <p className="h5">{notifier.detail}</p>
                </Alert>
            </Modal>

            <UIBlocker
                theme="bounce"
                isVisible={blocker.blocked}
                message={blocker.blockMessage}
            />
        </main>
    );
}

export default App;