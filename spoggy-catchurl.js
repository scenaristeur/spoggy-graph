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

// These are the elements needed by this element.
//import { plusIcon, minusIcon } from './../my-icons.js';

// These are the shared styles needed by this element.
//import { ButtonSharedStyles } from './../button-shared-styles.js';
import  '/node_modules/evejs/dist/eve.custom.js';
import { CatchurlAgent } from './agents/CatchurlAgent.js'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SpoggyCatchurl extends LitElement {
  render() {
    const { _endpoint, _dataset, _query, _graph, _source, _mode, disabled } = this;
    return html`

    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>
    <div>
    <p>
    CATCH URL </br>
    Params are <br>
    Endpoint : ${_endpoint}   et  Dataset :  ${this._dataset}</br>
    Query : ${_query}</br>
    Graph : ${_graph}</br>
    Source : ${_source}</br>
    MODE : ${_mode} </br>
    <div>${disabled ? 'Off' : 'On'}</div>
    </p>
    <p>test : http://127.0.0.1:8081/?endpoint=http://127.0.0.1:3030&source=https://raw.githubusercontent.com/scenaristeur/heroku-spoggy/master/public/exemple_files/Spoggy_init2.json&graph=plop&query=SELECT * WHERE {?s ?p ?o}</p>
    </div>
    `;
  }

  static get properties() { return {
    _params: Object,
    _endpoint: String,
    _dataset: String,
    _query: String,
    _graph: String,
    _source: String,
    _mode: String,
    disabled :Boolean
  }};

  constructor() {
    super();

    this.params = this.recupParams();
    console.log(this.params)

    if (this.params.hasOwnProperty("endpoint") && this.params.endpoint != undefined && this.params.endpoint.length > 0){
      this._endpoint = this.params.endpoint;
      this._mode = "global";
      console.log('Connexion au endpoint ', this._endpoint);
    }
    if (this.params.hasOwnProperty("dataset") && this.params.dataset != undefined && this.params.dataset.length > 0){
      this._dataset = this.params.dataset;

      console.log('avec le dataset ', this._dataset);
    }
    if (this.params.hasOwnProperty("query") && this.params.query != undefined && this.params.query.length > 0){
      this._query = this.params.query;

      console.log('Execution de la requete ', this._query);
    }
    if (this.params.hasOwnProperty("graph") && this.params.graph != undefined && this.params.graph.length > 0){
      this._graph = this.params.graph;
      this._mode = "collab";
      console.log('Mode Collaboratif connexion au graphe', this._graph);
    }
    if (this.params.hasOwnProperty("source") && this.params.source != undefined && this.params.source.length > 0){
      this._source  = this.params.source;
      this._mode = "solo";
      console.log('Import & Chargement du fichier source', this._source);
    }
    this.disabled = false;
  }

  firstUpdated(){
  //  console.log("update");
    //  console.log("eve",eve);
    this.agentCatchurl = new CatchurlAgent('agentCatchurl', this);
      console.log(this.agentCatchurl);
    this.agentCatchurl.send('agentApp', {type: 'dispo', name: 'agentCatchurl' });
    console.log("catchurl");
  }




  recupParams(){
    var params = (function(a) {
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i)
      {        var p=a[i].split('=', 2);
      if (p.length == 1)
      b[p[0]] = "";
      else
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'));
  return params;
}

}

window.customElements.define('spoggy-catchurl', SpoggyCatchurl);
