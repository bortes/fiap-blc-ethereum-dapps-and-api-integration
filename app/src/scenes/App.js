import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIBlocker from 'react-ui-blocker';
import { Alert, Modal } from 'react-bootstrap';

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
    const [errorToConnect, setErrorToConnect] = useState();

    const dispatch = useDispatch();
    const blocker = useSelector(state => state.blockerState);
    const notifier = useSelector(state => state.notifierState);

    useEffect(() => {
        dispatch(unnotify())

        dispatch(blockUI('conectando-se a rede...'));

        WadaagService.getSocialContractName()
            .then(data => {
                setErrorToConnect(false);
            })
            .catch(reason => {
                setErrorToConnect(true);
            })
            .finally(() => {
                dispatch(unblockUI());
            });
    }, []);

    return (
        <main role="main">
            {errorToConnect === false && <Wadaag />}

            <Modal show={errorToConnect}>
                <Modal.Header>
                    <div className="modal-title h4 text-danger">Ops!!</div>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Não foi possível se conectar à rede blockchain.
                    </p>
                    <p>
                        Por favor, verifique sua conexão com a rede e se o contrato esta publicado. Tente novamente.
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