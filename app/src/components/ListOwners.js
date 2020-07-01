import React, { Component } from 'react';
import { connect } from 'react-redux';

import { blockUI, unblockUI } from '../actions/BlockerAction';
import WadaagService from '../services/WadaagService';

/**
 * Componente responsavel por listar os participantes.
 *
 * @author bortes
 */
class ListOwners extends Component {
    state = {
        socialContractName: '',
        totalRegisteredOwners: '',
        totalAllowedOwners: ''
    };

    componentDidMount() {
        blockUI('consultando dados...');

        const p1 = WadaagService.getSocialContractName()
            .then(data => {
                this.setState({
                    socialContractName: data,
                });
            });

        const p2 = WadaagService.getTotalRegisteredOwners()
            .then(data => {
                this.setState({
                    totalRegisteredOwners: data,
                });
            });

        const p3 = WadaagService.getTotalAllowedOwners()
            .then(data => {
                this.setState({
                    totalAllowedOwners: data,
                });
            });

        Promise.all([p1, p2, p3])
            .finally(() => {
                // unblockUI();
            });
    }

    /**
     * Renderiza o componente.
     *
     * @author bortes
     */
    render() {
        const { socialContractName, totalRegisteredOwners, totalAllowedOwners } = this.state;

        return (
            <div className="container">
                <p>1. grupo = {socialContractName}</p>
                <p>2. total de participantes registrados = {totalRegisteredOwners}</p>
                <p>3. total de participantes permitidos = {totalAllowedOwners}</p>
            </div>
        );
    }
}


/**
 * Mapeia o estado da aplicacao na propriedade ".props" disponibilizadas dentro dos componentes.
 *
 * @author bortes
 */
const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(ListOwners);