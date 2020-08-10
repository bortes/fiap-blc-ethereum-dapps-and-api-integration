import React, { Component } from 'react';
import { connect } from 'react-redux';


/**
 * Componente responsavel por exibir as interfaces do contrato.
 *
 * @author bortes
 */
class Wadaag extends Component {
    state = {
        socialContractName: '',
        totalRegisteredOwners: '',
        totalAllowedOwners: ''
    };

    componentDidMount() {
    }

    /**
     * Renderiza o componente.
     *
     * @author bortes
     */
    render() {

        return (
            <div className="container">
                <p>
                    <span className="text-danger">balanceOf</span>
                    =
                    <span>saldo do endereço</span>
                </p>
                <p>
                    <span className="text-danger">countOwners</span>
                    =
                    <span>total de participantes</span>
                </p>

                <p>
                    <span className="text-danger">deposit</span>
                    =
                    <span>efetuar um deposito</span>
                </p>

                <p>
                    <span className="text-danger">isOwner</span>
                    =
                    <span>verificar se o endereço é um participantes</span>
                </p>

                <p>
                    <span className="text-danger">listOwners</span>
                    =
                    <span>listar os endereços participantes</span>
                </p>

                <p>
                    <span className="text-danger">maxOwners</span>
                    =
                    <span>quantidade maxima de participantes</span>
                </p>

                <p>
                    <span className="text-danger">name</span>
                    =
                    <span>nome da economia</span>
                </p>

                <p>
                    <span className="text-danger">percOf</span>
                    =
                    <span>% de participação do endereço</span>
                </p>

                <p>
                    <span className="text-danger">totalDeposited</span>
                    =
                    <span>total geral depositado</span>
                </p>

                <p>
                    <span className="text-danger">totalOwner</span>
                    =
                    <span>total depositado</span>
                </p>

                <p>
                    <span className="text-danger">transferRatio</span>
                    =
                    <span>transaferência</span>
                </p>

                <p>
                    <span className="text-danger">withdrawal</span>
                    =
                    <span>saque</span>
                </p>
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

export default connect(mapStateToProps)(Wadaag);