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
import '@polymer/iron-ajax/iron-ajax.js';
// These are the elements needed by this element.
//import { plusIcon, minusIcon } from './../my-icons.js';

// These are the shared styles needed by this element.
//import { ButtonSharedStyles } from './../button-shared-styles.js';
import  'evejs/dist/eve.min.js';
import { FusekiAgent } from './agents/FusekiAgent.js'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SpoggyFuseki extends LitElement {
  render() {
    //  const { endpoint, dataset, query } = this;
    return html`

    <style>
    .green { color: green; }
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
    on-response="_handleFusekiPing"
    on-error="_handleFusekiPingError"
    ></iron-ajax>

    <iron-ajax
    id="server_req"
    url="{{url_server}}"
    method="GET"
    content-type="application/text"
    handle-as="text"
    on-response="_handleFusekiServer"
    on-error="_handleFusekiServerError"
    ></iron-ajax>

    <div>
    <p>
    Endpoint : <span class="green">${this.endpoint}</span><hr>
    Dataset :  <span class="green">${this.dataset}</span><hr>
    Query : <span class="green">${this.query}</span><hr>

    </div>
    `;
  }

  static get properties() { return {
    dataset: String,
    query: String,
    endpoint: {type: String}
  }};

  constructor() {
    super();
  }

  firstUpdated(){
    //  console.log("update");
    //  console.log("eve",eve);
    this.agentFuseki = new FusekiAgent('agentFuseki', this);
    console.log(this.agentFuseki);
    this.agentFuseki.send('agentApp', {type: 'dispo', name: 'agentFuseki' });
    //console.log("fuseki");
    this._ajaxFuseki = this.shadowRoot.getElementById('requestFuseki');

  }

  updated(endpoint, dataset, query){
    //  super.updated(data)
    console.log("updated", this.endpoint, this.dataset, this.query);
    /*var dataset =  JSON.stringify(eval("(" + this.data + ")"));
    if (dataset != undefined){
    console.log(dataset)
    console.log(this.network)
    var nodes = dataset.nodes;
    var edges = dataset.edges;
    console.log(nodes);
    console.log(edges);
    this.network.body.data.nodes.update(nodes);
    this.network.body.data.edges.update(edges);
  }*/
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



ping_Fuseki(endpoint){
  this.url_fuseki = endpoint.url;
  this.url_fuseki_ping = endpoint.url+"/$/ping";
  //  this.$.status_req.body = { "email": "abc@gmail.com", "password": "password" };
  console.log(this.url_fuseki_ping);
  this.$.fusekiPing.generateRequest();
}


//PING
_handleFusekiPing(data){
  console.log("ping  Fuseki ok");

  this.pingFuseki = data;
  console.log(data);
  this.status = data.detail.response;
  console.log(this.status);
  this.url_server = this.url_fuseki+"/$/server";
  //  this.$.status_req.body = { "email": "abc@gmail.com", "password": "password" };
  console.log(this.url_server);
  this.$.server_req.generateRequest();
  //this.$.fusekiPopup.toggle();
  this.agentFuseki.send('agentGlobal', {type: "updateEndpointData", ping: this.status})

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
  console.log(data);
  var clemodif = data.detail.response.replace(/ds\./g, "ds_")
  this.server = JSON.parse(clemodif);
  console.log(this.server);
  this.datasets = this.server.datasets;
  if(this.dataset == undefined){
    this.dataset = this.datasets[0].ds_name;
  }
  console.log(this.datasets);
  console.log("selected "+this.dataset);
  this.agentFuseki.send('agentGlobal', {type: "updateEndpointData", server:{datasets: this.datasets, selected: this.dataset}});
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


}

window.customElements.define('spoggy-fuseki', SpoggyFuseki);
