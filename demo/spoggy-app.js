import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import  'evejs/dist/eve.min.js';
import { AppAgent } from '../agents/AppAgent.js';

import "../spoggy-catchurl.js";
import "../spoggy-graph.js";
import "../spoggy-fuseki.js";




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


    SPOGGY3-GRAPH <a href="https://github.com/scenaristeur/spoggy-graph" target="_blank">github</a>

    <table border="1">
    <th>
    DEMO SPOGGY-GRAPH
    </th>


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
    copie de https://protege.stanford.edu/ontologies/pizza/pizza.owl
    <paper-input
    id="inputRdf"
    label="Fichier source au format RDF / turtle / owl.. :"
    value="https://raw.githubusercontent.com/scenaristeur/spoggy-graph/master/data/pizza.owl">
    </paper-input>
    <paper-button raised @click="${(e) =>  this._load_rdf(e)}">Charger</paper-button>



    </td>
    <td>
    <spoggy-graph id="rdfgraph" name="jsongraph" source="https://protege.stanford.edu/ontologies/pizza/pizza.owl" >
    Chargement du graphe
    </spoggy-graph>
    </td>
    </tr>


    <tr>
    <td>
    Interaction avec un serveur Solid <br>
    récupération des infos de https://smag0.solid.community/
    <br>
    https://smag0.solid.community/profile/card#me<paper-button raised @click="${(e) =>  this._default_solid(e)}">set Smag0 as default</paper-button>
    <br>
    <p>
    <paper-button id="solidLogin" raised @click="${(e) =>  this._solid_login(e)}">Login</paper-button>
    </p>
    <p>
    <paper-button id="solidLogout" raised @click="${(e) =>  this._solid_logout(e)}">Logout</paper-button>
    </p>
    <paper-input
    id="inputSolid"
    label="Solid Profil :"
    value="https://smag0.solid.community/">
    </paper-input>
    <paper-button raised @click="${(e) =>  this._load_solid(e)}">View</paper-button>

    <dl id="viewer">
    <dt>Full name</dt>
    <dd id="fullName"></dd>
    <dt>Friends</dt>
    <dd>
    <ul id="friendsLi"></ul>
    </dd>
    <dt>Friends Error</dt>
    <dd>
    <ul id="friendsError"></ul>
    </dd>


    </dl>

    </td>
    <td>
    <spoggy-graph id="solidgraph" name="solidgraph" source="https://smag0.solid.community/profile/card#me" >
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
      jsonData: {type: Object},
      endpoint: {type: String},
      dataset: {type: String},
      query: {type: String},
      fusekiData: {type: Object}
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

    //SOLID
    //  this.FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

    this._solidLoginBtn = this.shadowRoot.getElementById('solidLogin');
    this._solidLogoutBtn = this.shadowRoot.getElementById('solidLogout');
    this._inputSolid = this.shadowRoot.getElementById('inputSolid');
    this._fullName = this.shadowRoot.getElementById('fullName');
    this._friends = this.shadowRoot.getElementById('friendsLi');
    this._friendsError = this.shadowRoot.getElementById('friendsError');

  //  console.log(solid)
    solid.auth.trackSession(session => {
      const loggedIn = !!session;


      if (loggedIn){
        this._solidLoginBtn.style.visibility="hidden";
        this._solidLogoutBtn.style.visibility="visible";
        this._inputSolid.value = session.webId;
        console.log(session.webId)
      }else{
        this._solidLoginBtn.style.visibility="visible";
        this._solidLogoutBtn.style.visibility="hidden";
        this._inputSolid.value = "";
      }
    });

  }


  /*
  update(visresults){
  console.log("updated", this.visresults);
}
update(visresults){
super.update(this.visresults);
console.log("updated", this.visresults);
}*/

_solid_login(e){
  console.log(solid);
  // Log the user in and out on click
  const popupUri = 'popup.html';
  solid.auth.popupLogin({ popupUri });
  // Update components to match the user's login status
}

_solid_logout(e){
  solid.auth.logout();
  this._clearSolidResults();
}

_clearSolidResults(){
  while( this._friends.firstChild ){
    this._friends.removeChild( this._friends.firstChild );
  }
  while( this._friendsError.firstChild ){
    this._friendsError.removeChild( this._friendsError.firstChild );
  }
}


_default_solid(e){
  this._inputSolid.value ="https://smag0.solid.community/profile/card#me";
}

_load_solid(e){
  var app = this;
  const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

  // Set up a local data store and associated data fetcher
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);
//  console.log(fetcher)
  // Load the person's data into the store
  const person = this._inputSolid.value ;

  fetcher.load(person).then(function(result){
  //  console.log(result)
    // Display their details
    const fullName = store.any($rdf.sym(person), FOAF('name'));
    console.log(fullName)
    app._fullName.textContent  = fullName && fullName.value;
    //console.log(app._fullName)
    //  $('#fullName').text(fullName && fullName.value);
    // Display their friends
    const friends = store.each($rdf.sym(person), FOAF('knows'));
    //  console.log(friends)
    app._clearSolidResults();

friends.forEach(async (friend) => {
  var node = document.createElement("LI");
  try{
    await fetcher.load(friend);
    const fullName = store.any(friend, FOAF('name'));
    console.log(fullName, friend.value)

    var createA = document.createElement('paper-button');
    createA.setAttribute("raised", "");
    var createAText = document.createTextNode(fullName && fullName.value || friend.value);
    //createA.setAttribute('href', '');
    createA.onclick = function() {
      app._inputSolid.value = friend.value;
      app._load_solid(this)
    };
    createA.appendChild(createAText);
    node.appendChild(createA);
    app._friends.appendChild(node)

  } catch (e) {
  //  console.log(e); // 30
    var createA = document.createElement('a');
    var createAText = document.createTextNode("error parsing : "+ friend.value);
    createA.appendChild(createAText);
    createA.setAttribute('href', friend.value);
    node.appendChild(createA);
    app._friendsError.appendChild(node)
  }

});






})

/*



// Display their friends
const friends = store.each($rdf.sym(person), FOAF('knows'));
$('#friends').empty();
friends.forEach(async (friend) => {
await fetcher.load(friend);
const fullName = store.any(friend, FOAF('name'));
$('#friends').append(
$('<li>').append(
$('<a>').text(fullName && fullName.value || friend.value)
.click(() => $('#profile').val(friend.value))
.click(loadProfile)));
});*/
}


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
