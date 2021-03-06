import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import  '/node_modules/evejs/dist/eve.custom.js';
import { AppAgent } from '../agents/AppAgent.js';

import "../spoggy-catchurl.js";
import "../spoggy-graph.js";
import "../spoggy-fuseki.js";
import "../spoggy-modele.js";





class SpoggyApp extends LitElement {
  render() {
    const { endpoint, dataset, query, _graph, _source, _mode, disabled, jsonData, fusekiData } = this;
    return html`

    <iron-ajax
    id="request"
    url="unknown"
    handle-as="json"
    debounce-duration="300">
    </iron-ajax>



    <iron-ajax
    id="requestRdf"
    url="unknown"
    handle-as="text"
    debounce-duration="300">
    </iron-ajax>



    <table border="1" style="width:100%">
    <th>
    SPOGGY-GRAPH
    </th>
    <th style="width:50%">
    <a href="https://github.com/scenaristeur/spoggy-graph" target="_blank">Github Spoggy-Graph</a>
    </th>

    <tr>
    <td>
    <h2>Methode Facile</h2>
    <ul>
    <li>Comment ajouter un <b>noeud</b> ?
    <ol>
    <li>Clique sur le bouton "Edit"</li>
    <li>Clique sur le bouton "Add Node"</li>
    <li>Clique n'importe dans un espace vide du graphe</li>
    <li>Une nouvelle fenêtre s'ouvre. Dans la case Label, donne un nom à ton noeud</li>
    <li>Clique sur le bouton "save"</li>
    </ol>
    </li>
    </ul>

    <ul>
    <li>Comment ajouter un <b>lien</b> ?
    <ol>
    <li>Clique sur le bouton "Edit" si il est présent, sinon clique sur le bouton "Add Edge"</li>
    <li>Clique sur un noeud du graphe et garde le bouton de ta souris appuyé et glisse ta souris vers un autre noeud, une fois ce noeud atteint, relâche le bouton de ta souris</li>
    <li>Un nouvelle fenêtre s'ouvre. Dans la case Label, donne un nom à ton lien</li>
    <li>Clique sur le bouton "save"</li>
    </ol>

    </li>
    </ul>
    </td>

    <td>
    <spoggy-graph id="novicegraph" name="novicegraph" >
    Chargement du graphe
    </spoggy-graph>
    </td>
    </tr>
    <tr>
    <td>
    <h2>Methode Expert</h2>
    <ol>
    <li>Repère le champ de saisie où il est écrit '3 mots, une virgule et Entrée'</li>
    <li>A cet endroit saisis 3 mots suivis d'une virgule et appuie sur la touche "Entrée"<br>
    exemple : Chat mange Souris, + Entrée
    </ol>

    <h2> Import / Export</h2>
    <span>Maintenant que tu es un expert de <a href="https://github.com/scenaristeur/spoggy-graph" target="_blank">Spoggy-Graph</a>, tu vas avoir envie de garder tes graphes.<br> Dans le champ de saisie que tu viens d'utiliser, tu peux saisir : </span>
    <ul>
    <li>
    <b>/e </b> pour exporter un graphe
    </li>
    <li>
    <b>/i </b> pour importer un graphe
    </li>
    <li>
    <b>/t </b> pour exporter un graphe au format <a href="https://fr.wikipedia.org/wiki/Turtle_(syntaxe)" target="_blank">Turtle / RDF</a>
    </li>
    <li>
    <b>/n </b> pour repartir sur un nouveau graphe vide
    </li>
    </ul>

    </td>
    <td>
    <spoggy-graph id="expertgraph" name="expertgraph"  >
    Chargement du graphe
    </spoggy-graph>
    </td>
    </tr>


    <tr>
    <td>
    Chargement d'un fichier source au format vis / spoggy (json)
    <paper-input
    id="inputJson"
    label="Fichier source au format vis / spoggy (json) :"
    value="https://raw.githubusercontent.com/scenaristeur/heroku-spoggy/master/public/exemple_files/Spoggy_init2.json">
    </paper-input>
    <paper-button raised @click="${(e) =>  this._load_json(e)}">Charger</paper-button>
    <!--<br>
    ou
    <paper-button raised>Parcourir (en cours)</paper-button>-->
    </td>
    <td>


    <spoggy-graph id="jsongraph" name="jsongraph" data="${jsonData}" source="https://raw.githubusercontent.com/scenaristeur/heroku-spoggy/master/public/exemple_files/Spoggy_init2.json" >
    Chargement du graphe
    </spoggy-graph>
    </td>
    </tr>





    <tr>
    <td>
    <spoggy-fuseki id="fusekiElem" endpoint="${endpoint}" dataset="${dataset}" query="${query}" ></spoggy-fuseki>
    </td>
    <td>
    <spoggy-graph id="endpointFuseki" name="endpointFuseki" data="${fusekiData}" >
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


    <tr>
    <td>
    Chargement d'un fichier source au format RDF / turtle / owl.. :<br>
    copie de https://protege.stanford.edu/ontologies/pizza/pizza.owl<br>
    un fichier rdf : http://www.iro.umontreal.ca/~lapalme/ift6282/RDF/IFT6282_0.rdf (a telecharger / pb cors)
    <paper-input
    id="inputRdf"
    label="Fichier source au format RDF / turtle / owl.. :"
    value="https://raw.githubusercontent.com/scenaristeur/spoggy-graph/master/data/pizza.owl">
    </paper-input>
    <paper-button raised @click="${(e) =>  this._load_rdf(e)}">Charger</paper-button>



    </td>
    <td>
    <spoggy-graph id="rdfgraph" name="rdfgraph" source="https://protege.stanford.edu/ontologies/pizza/pizza.owl" >
    Chargement du graphe
    </spoggy-graph>
    </td>
    </tr>



    <tr>
    <td>

    EN TEST  : <br>
    <a href="./solid.html" target="_blank">Solid test</a><br>

  <a href="./solidbins.html" target="_blank">Solid BINS test</a><br>

    <a href="./rdflib.html" target="_blank">RDFLIB test</a>
    </td>
    <td>

    </td>
    </tr>



    </table>




    <spoggy-catchurl></spoggy-catchurl>

    <spoggy-modele></spoggy-modele>
    `;
  }


  static get properties() {
    return {
      source: {type: String},
      jsonData: {type: Object},
      endpoint: {type: String},
      dataset: {type: String},
      query: {type: String},
      fusekiData: {type: Object},
      role: {type: String}
    };
  }

  constructor() {
    super();
    this.source = "blop";

    //  this._testRdfExt();
    //  this._testN3Parser();
    //  this._testRdfFetch();
  }


  firstUpdated() {
    //  console.log("vis",vis);
    //  console.log("eve",eve);
    this.agentApp = new AppAgent('agentApp', this);
    //  console.log(this.agentApp);
    //  this.agentApp.send('agentApp', {type: 'dispo', name: 'agentGraph' });
    this._ajax = this.shadowRoot.getElementById('request');
    this._inputJson = this.shadowRoot.getElementById('inputJson');





    this._inputRdf = this.shadowRoot.getElementById('inputRdf');
    this._ajaxRdf = this.shadowRoot.getElementById('requestRdf');



  }


  /*
  update(visresults){
  console.log("updated", this.visresults);
}
update(visresults){
super.update(this.visresults);
console.log("updated", this.visresults);
}*/



_load_json(e){
  //  console.log(e);
  //  console.log(this._inputJson.value);
  this._ajax.url = this._inputJson.value;
  //  console.log(this._ajax);
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
  //  console.log(rep);
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



_load_rdf(e){
  //  console.log(e);
  //  console.log(this._inputRdf.value);
  this._ajaxRdf.url = this._inputRdf.value;
  //  console.log(this._ajaxRdf);
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
let request = this._ajaxRdf.generateRequest();
request.completes.then(function(request) {
  // succesful request, argument is iron-request element
  var rep = request.response;

  app._handleResponseRdf(rep);
}, function(rejected) {
  // failed request, argument is an object
  let req = rejected.request;
  let error = rejected.error;
  _handleErrorResponseRdf(error)
  console.log("error", error)
}
)
}

_handleResponseRdf(data){
  console.log(data);
  //this.jsonData = JSON.stringify(data);

}

_handleErrorResponseRdf(data){
  console.log(data)
}


updateNetwork(visresults){
  console.log(visresults)
  this.fusekiData = JSON.stringify(visresults);
}


////////////////////////////// TEST RDF-EXT

_testRdfExt(){
  console.log("##########################RDF ",rdf)


  const store = new SparqlStore({
    factory: rdf,
    endpointUrl: 'https://dbpedia.org/sparql'
  })

  // fetch all triples for the Eiffel Tower subject and opening date predicate
  const stream = store.match(
    rdf.namedNode('http://dbpedia.org/resource/Eiffel_Tower'),
    rdf.namedNode('http://dbpedia.org/ontology/openingDate')
  )

  // forward errors to the console
  stream.on('error', (err) => {
    console.error(err.stack || err.message)
  })

  // write the object value of the matching triple to the console
  stream.on('data', (quad) => {
    console.log(quad)
    console.log('The Eiffel Tower opened on: ' + quad.object.value)
  })

  console.log("##########################RDF ",rdf)
}


_testRdfFetch(){
  //  let rdfFetch = new rdfFetch('http://dbpedia.org/resource/Amsterdam');

  // use the Dataset API to read parts of Amsterdam
  rdfFetch('http://dbpedia.org/resource/Amsterdam').then((res) => {
    console.log("################FETCH ", res)
    return res.dataset()
  }).then((dataset) => {
    const partQuads = dataset.match(null, rdf.namedNode('http://dbpedia.org/ontology/part'))

    console.log(partQuads.length + ' parts found')

    // convert to array to process none quad results
    return Promise.all(partQuads.toArray().map((partQuad) => {
      return rdfFetch(partQuad.object.toString()).then((res) => {
        return res.dataset()
      }).then((part) => {
        // filter label quad based on predicate and object language
        const labelQuad = part.filter((quad) => {
          return quad.predicate.value === 'http://www.w3.org/2000/01/rdf-schema#label' && quad.object.language === 'en'
        }).toArray().shift()

        // filter population and populationTotal quad
        const populationQuad = part.filter((quad) => {
          return quad.predicate.value === 'http://dbpedia.org/property/population' ||
          quad.predicate.value === 'http://dbpedia.org/ontology/populationTotal'
        }).toArray().shift()

        return {
          label: labelQuad && labelQuad.object.value,
          population: populationQuad && parseFloat(populationQuad.object.value)
        }
      })
    }))
  }).then((result) => {
    result = result.filter(i => i.population).sort((a, b) => a.population - b.population)

    console.log(JSON.stringify(result, null, ' '))
  }).catch((err) => {
    console.error(err.stack || err.message)
  })

}


_testN3Parser(){
  // create N3 parser instance
  let parser = new N3Parser({factory: rdf})

  // Read a Turtle file and stream it to the parser
  let quadStream = parser.import('/node_modules/tbbt-ld/data/person/sheldon-cooper.ttl')
  //let quadStream = parser.import(fs.createReadStream('./node_modules/tbbt-ld/data/person/sheldon-cooper.ttl'))

  // create a new dataset and import the quad stream into it (reverse pipe) with Promise API
  rdf.dataset().import(quadStream).then((dataset) => {
    // loop over all quads an write them to the console
    dataset.forEach((quad) => {
      console.log(quad.toString())
    })
  })
}








}

window.customElements.define('spoggy-app', SpoggyApp);
