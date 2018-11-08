/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/*
Module pour attrapper les parametres d'url :
//http://127.0.0.1:8081/?endpoint=http://127.0.0.1:3030&dataset=test&query=SELECT * WHERE {?s ?p ?o}&source=http://test.json&graph=plop

*/

import { LitElement, html } from '@polymer/lit-element';
//import { repeat } from '@polymer/lit-element/node_modules/lit-html/lib/repeat.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
//import 'web-animations-js/web-animations-next.min.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';


import  'evejs/dist/eve.custom.js';
import { FusekiAgent } from './agents/FusekiAgent.js'

class SpoggyFuseki extends LitElement {
  render() {
    const { endpoint, dataset, query, datasets } = this;
    return html`

    <style>
    .green { color: green; }
    .red { color: red; }
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>

    <iron-ajax
    id="requestFuseki"
    url="unknown"
    handle-as="json"
    debounce-duration="300">
    </iron-ajax>

    <iron-ajax
    id="fusekiPing"
    url="{{url_fuseki_ping}}"
    method="GET"
    content-type="application/text"
    handle-as="text"
    ></iron-ajax>

    <iron-ajax
    id="server_req"
    url="{{url_server}}"
    method="GET"
    content-type="application/text"
    handle-as="text"
    ></iron-ajax>

    <div>


    Requete 'SELECT * WHERE {?s ?p ?o}' vers un endpoint Fuseki :<br>
    <paper-input
    id="inputFusekiEndpoint"
    label="Fuseki Sparql Endpoint"
    value="${endpoint}"
    @change="${(e) =>  this._endpointChanged(e)}">

    </paper-input>


    <paper-dropdown-menu label="Dataset">
    <paper-listbox slot="dropdown-content"  selected="${dataset}">
    ${datasets.map((i) => html `
      <paper-item @click="${(e) =>  this._datasetChanged(e)}">
      ${i.ds_name}
      </paper-item>
      `)}
      </paper-listbox>
      </paper-dropdown-menu>


      <paper-input
      id="inputFusekiQuery"
      label="Fuseki Sparql Query"
      value="SELECT * WHERE {?s ?p ?o}"
      @change="${(e) =>  this._queryChanged(e)}">
      </paper-input>

      <paper-button raised @click="${(e) =>  this._load_fuseki(e)}">Charger</paper-button>
      <br><br><br>

      <small>
      todo :  (recupérer les datasets)<br>
      <a href="http://jena.apache.org/documentation/fuseki2/" target="_blank">Apache Jena Fuseki</a>
      </small>


      Endpoint : <span class="green">${this.endpoint}</span><hr>
      Dataset :  <span class="green">${this.dataset}</span><hr>
      Query : <span class="green">${this.query}</span><hr>
      </div>
      `;
    }

    static get properties() { return {
      dataset: String,
      query: String,
      endpoint: {type: String},
      datasets: {type: Array}
    }};

    constructor() {
      super();

      this.datasets= [];
      /*let ds1 = {};
      ds1.name = "test",
      this.datasets.push (ds1);
      let ds2 = {};
      ds2.name = "test",
      this.datasets.push (ds2);
      console.log(this.datasets)*/
    }

    firstUpdated(){
      //  console.log("update");
      //  console.log("eve",eve);
      this.endpoint = "http://127.0.0.1:3030";

      this.agentFuseki = new FusekiAgent('agentFuseki', this);
      console.log(this.agentFuseki);
      this.agentFuseki.send('agentApp', {type: 'dispo', name: 'agentFuseki' });
      //console.log("fuseki");
      this._ajaxFuseki = this.shadowRoot.getElementById('requestFuseki');
      this._ajaxFusekiPing = this.shadowRoot.getElementById('fusekiPing');
      this._ajaxServerReq = this.shadowRoot.getElementById('server_req')
      this._inputFusekiEndpoint = this.shadowRoot.getElementById('inputFusekiEndpoint');
      this._inputFusekiDataset = this.shadowRoot.getElementById('inputFusekiDataset');
      this._inputFusekiQuery = this.shadowRoot.getElementById('inputFusekiQuery');
      this.fusekiElem = this.shadowRoot.getElementById('fusekiElem');
      this._fuseki_ping(this.endpoint)
    }

    _endpointChanged(e){
      console.log(e)
      this.endpoint = this._inputFusekiEndpoint.value;
      this._fuseki_ping();
    }
    _datasetChanged(e){
      console.log(e)
      //this.dataset = this._inputFusekiDataset.value;
      console.log(e.target.innerText)

      var selectedItem = e.target.innerText;
      console.log(selectedItem)
      if (selectedItem) {
        console.log("selected: " + selectedItem);
        this.dataset = selectedItem.substr(1);
      }
    }
    _queryChanged(e){
      console.log(e)
      this.query = this._inputFusekiQuery.value;
    }

    isEqual(mode, test){
      return mode == test;
    }

    /*  updated(endpoint, dataset, query){
    //  super.updated(data)
    console.log("updated", this.endpoint, this.dataset, this.query);

    if (this._ajaxFuseki != undefined && this.endpoint != "undefined"){

    let options = {
    query: this.query,
    format: 'application/sparql-results+json',
  }
  this._ajaxFuseki.url = this.endpoint+"/"+this.dataset;
  this._ajaxFuseki.params = options;
  var app = this;
  let request = this._ajaxFuseki.generateRequest();
  request.completes.then(function(request) {
  // succesful request, argument is iron-request element
  var rep = request.response;
  app._handleResponseFuseki(rep);
}, function(rejected) {
// failed request, argument is an object
let req = rejected.request;
let error = rejected.error;
app._handleErrorResponseFuseki(error)
//  console.log("error", error)
}
)
}
}*/

_load_fuseki(e){
  this.endpoint = this._inputFusekiEndpoint.value;
  //this.dataset = this._inputFusekiDataset.value;
  this.query = this._inputFusekiQuery.value;
  this._runQuery();
}


_runQuery(){
  let options = {
    query: this.query,
    format: 'application/sparql-results+json',
  }
  this._ajaxFuseki.url = this.endpoint+"/"+this.dataset;
  this._ajaxFuseki.params = options;
  var app = this;
  let request = this._ajaxFuseki.generateRequest();
  request.completes.then(function(request) {
    // succesful request, argument is iron-request element
    var rep = request.response;
    app._handleResponseFuseki(rep);
  }, function(rejected) {
    // failed request, argument is an object
    let req = rejected.request;
    let error = rejected.error;
    app._handleErrorResponseFuseki(error)
    //  console.log("error", error)
  }
)
}

_handleResponseFuseki(data){
  console.log(data);
  //  this.jsonData = JSON.stringify(data);
  let vars=data.head.vars;
  let results=data.results.bindings;
  //  console.log(this.head);
  //console.log(results);

  this.visresults = this._sparqlToVis(results);
  console.log(this.visresults);
  this.agentFuseki.send('agentApp', {type: 'visresults', visresults: this.visresults });
}

_handleErrorResponseFuseki(data){
  console.log(data)
}

_sparqlToVis(sparqlRes){
  let app = this;
  var visRes = {edges:[], nodes:[]};
  //console.log("sparqlRes length: ",sparqlRes.length)
  sparqlRes.forEach(function(sr){



    console.log("-----------------------",sr);

    switch (sr.p.value){
      case "http://www.w3.org/2000/01/rdf-schema#label":
      let id = sr.s.value.replace('http://smag0.blogspot.fr/NS#_', '')
      let node = {id: id, label: sr.o.value, y: 2*Math.random(), type: "node"};
      console.log("LABEL");

      if (!visRes.nodes.hasOwnProperty(id)){

        visRes.nodes[id] = node;
        console.log("creation", node)
      }else{

        visRes.nodes[id].label = node.label;
        visRes.nodes[id].y = 2*Math.random();
        visRes.nodes[id].type = "node";
        console.log("maj", visRes[id])
      }
      break;
      default:
      console.log("A traiter",sr);
      let s = sr.s.value.split('#');
      let p = sr.p.value.split('#');



      let nodeS ={};
      nodeS.id = s[1];
      nodeS.prefix = s[0];
      nodeS.label = s[1];
      nodeS.type = "node";

      let nodeO ={};
      console.log(sr.o.type);
      switch (sr.o.type){
        case "uri":
        console.log(sr.o);
        let o = sr.o.value.split('#');

        nodeO.id = o[1];
        nodeO.prefix = o[0];
        nodeO.label = o[1];
        nodeO.type = "node";
        break;
        case "literal":
        console.log("literal");

        break;
        default:
        console.log("NON pris en charge");
        console.log(sr.o.type)
      }

      //  let nodeO = {id: o[1], prefix:o[0], label: o[0], type: "node"};
      let edgeP = {label: p[1], prefix:p[0], from: nodeS.id, to: nodeO.id, type: "edge"};
      console.log("nodeS",nodeS)
      console.log("nodeO",nodeO)
      console.log("edgeP",edgeP)
      visRes.nodes.push(nodeS);
      visRes.nodes.push(nodeO);
      visRes.edges.push(edgeP);
    }





  });
  console.log(visRes)
  return visRes;
}


_tripletToLabel(t, visRes){
  console.log(t);
  let id = sr.s.value.replace('http://smag0.blogspot.fr/NS#_', '')
  let node = {id: id, label: sr.o.value, y: 2*Math.random(), type: "node"};
  console.log("LABEL");
  console.log(node)
  if (!visRes.hasOwnProperty(id)){
    console.log("aucun noeud n'existe ->creation")
    visRes[id] = node;

  }else{
    console.log("un noeud existe --> maj du label")
    visRes[id].label = node.label;
    visRes[id].y = 2*Math.random();
    visRes[id].type = "node"
  }

  return visRes

}



_fuseki_ping(){
  //this.url_fuseki = endpoint;
  this._ajaxFusekiPing.url = this.endpoint+"/$/ping";
  //  this.$.status_req.body = { "email": "abc@gmail.com", "password": "password" };
  console.log(this._ajaxFusekiPing);
  //this._ajaxFusekiPing.generateRequest();

  var app = this;
  let request = this._ajaxFusekiPing.generateRequest();
  request.completes.then(function(request) {
    // succesful request, argument is iron-request element
    var rep = request.response;
    app._handleFusekiPing(rep);
  }, function(rejected) {
    // failed request, argument is an object
    let req = rejected.request;
    let error = rejected.error;
    app._handleFusekiPingError(error)
    //  console.log("error", error)
  }
)
}


//PING
_handleFusekiPing(data){
  console.log("ping  Fuseki ok");
  let app = this;
  this.pingFuseki = data;
  console.log(data);
  //  this.status = data.detail.response;
  //  console.log(this.status);
  this._ajaxServerReq.url = this.endpoint+"/$/server";
  //  this.$.status_req.body = { "email": "abc@gmail.com", "password": "password" };
  console.log(this._ajaxServerReq);
  //  this.server_req.generateRequest();
  let request = this._ajaxServerReq.generateRequest();
  request.completes.then(function(request) {
    // succesful request, argument is iron-request element
    var rep = request.response;
    app._handleFusekiServer(rep);
  }, function(rejected) {
    // failed request, argument is an object
    let req = rejected.request;
    let error = rejected.error;
    app._handleFusekiServerError(error)
    //  console.log("error", error)
  }
)
//this.$.fusekiPopup.toggle();
//this.agentFuseki.send('agentGlobal', {type: "updateEndpointData", ping: this.status})

//  this.$.labelEndpoint.label = "Endpoint : ping Fuseki OK";
}
_handleFusekiPingError(data){
  console.log("error ping  Fuseki");
  //  this.$.labelEndpoint.label = "Endpoint : ping Erreur"
  this.pingFuseki = "";
  console.log(data);
  console.log(data.detail);
  console.log(data.detail.error);
  console.log(data.detail.error.message);
  console.log(data.detail.request);
  console.log(data.detail.response);
  console.log(data.detail.request.response);
  this.status = data.detail.error.type + ", Impossible d'atteindre l'endpoint";
  console.log(this.status);
  this.agentFuseki.send('agentGlobal', {type: "updateEndpointData", error: this.status});
  //  this.server = data.detail.error.type + ", Veuillez vérifier l'accès au endpoint "+this.url_status;
}

//SERVER
_handleFusekiServer(data){
  console.log("server ok");
  //  console.log(data);
  var clemodif = data.replace(/ds\./g, "ds_")
  this.server = JSON.parse(clemodif);
  //  console.log(this.server);
  this.datasets = this.server.datasets;
  if(this.dataset == "undefined"){
    this.dataset = this.datasets[0].ds_name;
  }
  console.log(this.datasets);
  console.log("selected2 ne fonctionne pas"+this.dataset);
  //  this.agentFuseki.send('agentGlobal', {type: "updateEndpointData", server:{datasets: this.datasets, selected: this.dataset}});
}
_handleFusekiServerError(data){
  console.log("error server");
  console.log(data);
  console.log(data.detail);
  console.log(data.detail.error);
  console.log(data.detail.error.message);
  console.log(data.detail.request);
  console.log(data.detail.response);
  console.log(data.detail.request.response);
  this.server = data.detail.error.type + ", Impossible d'atteindre les informations relatives a l'endpoint ";
  console.log(this.server);
  this.agentFuseki.send('agentGlobal', {type: "updateEndpointData", server: {error:this.server}});
}

graphToQuery(message){
  var prequery = this.graphToPreQuery(message)
  console.log(prequery);
}

graphToPreQuery(message){
  var date = Date.now();
  console.log(date, message.actions);
  var prequery = {};
  prequery.type = "UPDATE";
  var body = [];
  var tevent = "smag:_"+date+" rdf:type smag:Update";
  body.push(tevent)
  var tlog = "smag:_"+date+" rdf:type smag:Event";
  body.push(tlog)



  message.actions.forEach(function(a){
    var triplets= [];
    console.log(a);

    /*var data = a.data;
    var id = data.id;

    var ttype = id+" rdf:type "+data.type;
    body.push(ttype)
    var tlabel = id+" rdfs:label "+data.label;
    body.push(tlabel)*/

    switch (a.type) {
      case "newNode":
      var node = a.data;
      console.log("node",node.id)
      var visnid = "vis:_"+node.id;
      console.log(visnid)
      var ntype = visnid+" rdf:type vis:"+node.type;
      body.push(ntype)
      var nlabel = visnid+' rdfs:label "'+node.label+'"';
      body.push(nlabel)

      break;
      case "newEdge":
      var edge = a.data[0];
      var id = "vis:_"+edge.id;
      console.log("edge",id)
      var etype = id+" rdf:type vis:"+edge.type;
      body.push(etype)
      var elabel = id+' rdfs:label "'+edge.label+'"';
      body.push(elabel)
      var efrom = id+ " vis:from vis:_"+edge.from;
      var eto = id+" vis:to vis:_"+edge.to;
      body.push(efrom)
      body.push(eto);
      var tcontent = "smag:_"+date+' rdfs:comment "'+edge.from+' '+edge.label+' '+edge.to+'"'; //"+efrom+" "+edgelabel+" "+eto"
      body.push(tcontent)
      break;
      default:
      console.log("PB , je ne connais pas ce type de message ", a.type)
    }


  });
  prequery.body = body;
  console.log(prequery)
  return prequery


}


}

window.customElements.define('spoggy-fuseki', SpoggyFuseki);
