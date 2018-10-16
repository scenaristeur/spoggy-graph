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
    endpoint: {type: String},
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
  /*  query:  ' SELECT distinct * WHERE { ?s rdfs:label ?label . \
  ?s rdf:type ?type . \
  OPTIONAL {   ?s dcterms:title ?title .} \
  FILTER(bif:contains(?label, "'+recherche+'")) . \
}  LIMIT 100',*/
query: this.query,
format: 'application/sparql-results+json',
}
this._ajaxFuseki.url = this.endpoint+"/"+this.dataset;
this._ajaxFuseki.params = options;
//console.log(options)
  //  console.log(this._ajaxFuseki)
    var app = this;
    let request = this._ajaxFuseki.generateRequest();
  //  console.log(request);
    request.completes.then(function(request) {
      // succesful request, argument is iron-request element
      var rep = request.response;
    //  console.log(rep);
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
    console.log(results);
console.log("results length: ",results.length)
    var visResults = this._sparqlToVis(results);
    console.log(visResults);

}

_handleErrorResponseFuseki(data){
  console.log(data)
}

_sparqlToVis(sparqlRes){
  var visRes = {edges:[]};
  console.log("sparqlRes length: ",sparqlRes.length)
  sparqlRes.forEach(function(sr){
      console.log(sr);

    //test du triplet sur predicate.value
    switch(sr.p.value){
      case "http://www.w3.org/2000/01/rdf-schema#label":
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

      break;

      default:
      //test du triplet sur object.value
      switch(sr.o.value){
        case 'http://smag0.blogspot.fr/NS#node':
        let id = sr.s.value.replace('http://smag0.blogspot.fr/NS#_', '')
        let node = {id: id, type: "node"};
        //  console.log("NOEUD");
        //  console.log(node)
        if (!visRes.hasOwnProperty(id)){
          //    console.log("ce noeud n'est pas recensé -> creation")
          visRes[id] = node;
        }else{
          //    console.log("ce noeud existe -> update")
          visRes[id].id = id;
          visRes[id].type = "node"
        }

        break;

        default:
        if(sr.s.value.startsWith("http://smag0.blogspot.fr/NS#_") && sr.o.value.startsWith("http://smag0.blogspot.fr/NS#_"))
        {
          //  console.log("Liens entre deux noeuds")
          let from =    sr.s.value.replace('http://smag0.blogspot.fr/NS#_', '')
          let to =  sr.o.value.replace('http://smag0.blogspot.fr/NS#_', '')
          let label  = sr.p.value.replace('http://smag0.blogspot.fr/NS#', '').replace(/_/g, ' ');
          let edge = {from: from, to: to, label: label, type: "edge"};
          visRes.edges.push(edge);
        }else{
          console.log("NON PRIS EN CHARGE : ")
          console.log(sr);
        }
      }
    }
  });
    console.log(visRes)
  return visRes;
}


}

window.customElements.define('spoggy-fuseki', SpoggyFuseki);
