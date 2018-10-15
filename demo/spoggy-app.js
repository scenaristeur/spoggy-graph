import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import  'evejs/dist/eve.min.js';
import { AppAgent } from '../agents/AppAgent.js';

import "../spoggy-catchurl.js";
import "../spoggy-graph.js";


class SpoggyApp extends LitElement {
  render() {
    const { _endpoint, _dataset, _query, _graph, _source, _mode, disabled, jsonData } = this;
    return html`

    <iron-ajax
    id="request"
    url="unknown"
    handle-as="json"
    debounce-duration="300">
    </iron-ajax>


    SPOGGY3-GRAPH <a href="https://github.com/scenaristeur/spoggy-graph" target="_blank">github</a>

    <table border="1">
    <th>
    DEMO SPOGGY-GRAPH
    </th>
    <tr>
    <td><br>

    <br>
    Chargement d'un fichier source au format vis / spoggy (json)
    <paper-input
    id="inputJson"
    label="Fichier source au format vis / spoggy (json) :"
    value="https://raw.githubusercontent.com/scenaristeur/heroku-spoggy/master/public/exemple_files/Spoggy_init2.json">
    </paper-input>
    <paper-button raised @click="${(e) =>  this._load_json(e)}">Charger</paper-button>
    <br>
    ou
    <paper-button raised>Parcourir</paper-button>
    </td>
    <td>
    <spoggy-graph id="jsongraphID" name="jsongraph-name" data="${jsonData}" source="https://raw.githubusercontent.com/scenaristeur/heroku-spoggy/master/public/exemple_files/Spoggy_init2.json" >
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
      source: {type: String},
      jsonData: {type: Object}

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
    this._ajax = this.shadowRoot.getElementById('request');
    this._inputJson = this.shadowRoot.getElementById('inputJson');
  }

  _load_json(e){
    console.log(e);
    console.log(this._inputJson.value);
    this._ajax.url = this._inputJson.value;
    console.log(this._ajax);
    //  this._ajax.generateRequest();
    /*
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this._ajax.url, true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
    console.log(xhr.responseText);
    // Get header from php server request if you want for something
    var cookie = xhr.getResponseHeader("Cookie");
    // alert("Cookie: " + cookie);
  }else{
  console.log("error ", xhr.responseText)
}
}
xhr.send();
*/
var app = this;
let request = this._ajax.generateRequest();
request.completes.then(function(request) {
  // succesful request, argument is iron-request element
  var rep = request.response;
  console.log(rep);
  app._handleResponse(rep);
}, function(rejected) {
  // failed request, argument is an object
  let req = rejected.request;
  let error = rejected.error;
  console.log("error", error)
}
)
}

_handleResponse(data){
  console.log(data);
  this.jsonData = JSON.stringify(data);

}

_handleErrorResponse(data){
  console.log(data)
}

}

window.customElements.define('spoggy-app', SpoggyApp);
