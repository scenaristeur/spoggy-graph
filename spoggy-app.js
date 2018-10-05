import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import  'evejs/dist/eve.min.js';
import { AppAgent } from './agents/AppAgent.js';

import "./spoggy-catchurl.js";
import "./spoggy-graph.js";


class SpoggyApp extends LitElement {
  render() {
    const { _endpoint, _dataset, _query, _graph, _source, _mode, disabled } = this;
    return html`
    SPOGGY3-GRAPH

    <table border="1">
      <th>
        DEMO SPOGGY-GRAPH
      </th>
      <tr>
        <td><br>

          <br>
          <paper-input
           label="Fichier source au format vis / spoggy (json) :"
           value="https://raw.githubusercontent.com/scenaristeur/heroku-spoggy/master/public/exemple_files/Spoggy_init2.json">
           </paper-input><paper-button raised >Charger</paper-button>
           <br>
           ou
          <paper-button raised>Parcourir</paper-button>

          </td>
          <td>
            <spoggy-graph id="jsongraphID" name="jsongraph-name" source="https://raw.githubusercontent.com/scenaristeur/heroku-spoggy/master/public/exemple_files/Spoggy_init2.json" >
            Chargement du graphe
          </spoggy-graph>
          </td>
        </tr>
        <tr>
          <td>
            Fichier source au format RDF / turtle / owl.. :<br>
            https://protege.stanford.edu/ontologies/pizza/pizza.owl
          </td>
          <td>
            <spoggy-graph id="rdfgraph" name="jsongraph" source="https://protege.stanford.edu/ontologies/pizza/pizza.owl" >
              Chargement du graphe
            </spoggy-graph>
          </td>
        </tr>
        <tr>
          <td>
            Requete 'SELECT * WHERE {?s ?p ?o}' vers un endpoint Fuseki :<br>
            http://127.0.0.1:3030/dataset
          </td>
          <td>
            <spoggy-graph id="endpointFuseki" name="endpointFuseki" endpoint="http://127.0.0.1:3030/dataset" endpoint-type="fuseki" query="SELECT * WHERE {?s ?p ?o}" >
              Chargement du graphe
            </spoggy-graph>
          </td>
        </tr>
        <tr>
          <td>
            Requete 'SELECT TourEiffel WHERE {?s ?p ?o}' vers un endopoint Virtuoso
          </td>
          <td>
            <spoggy-graph id="endpointVirtuoso" name="endpointVirtuoso" endpoint="http://dbpedia.org/sparql" endpoint-type="virtuoso" query="SELECT TourEiffel WHERE {?s ?p ?o}" >
              Chargement du graphe
            </spoggy-graph>
          </td>
        </tr>
        <tr>
          <td>
            Connexion à un graphe collaboratif géré par socket.io
          </td>
          <td>
            <spoggy-graph id="grapheCollaboratif" name="grapheCollaboratif" graph="graphCollaboratifName" >
              Chargement du graphe
            </spoggy-graph>
          </td>
        </tr>
      </table>
        <spoggy-catchurl></spoggy-catchurl>
    `;
  }


    static get properties() {
      return {
        source: {type: String}
      };
    }

    constructor() {
      super();
      this.source = "blop";

    }


    firstUpdated() {
    //  console.log("vis",vis);
      //  console.log("eve",eve);
        this.agentApp = new AppAgent('agentApp', this);
        console.log(this.agentApp);
      //  this.agentApp.send('agentApp', {type: 'dispo', name: 'agentGraph' });

      }

}

window.customElements.define('spoggy-app', SpoggyApp);
