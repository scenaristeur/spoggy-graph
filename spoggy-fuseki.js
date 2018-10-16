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
    //const { _endpoint, _dataset, _query, _graph, _source, _mode, disabled } = this;
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
    console.log("update");
    //  console.log("eve",eve);
    this.agentFuseki = new FusekiAgent('agentFuseki', this);
    console.log(this.agentFuseki);
    this.agentFuseki.send('agentApp', {type: 'dispo', name: 'agentFuseki' });
    //console.log("fuseki");
  }






}

window.customElements.define('spoggy-fuseki', SpoggyFuseki);
