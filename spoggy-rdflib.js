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
import  'evejs/dist/eve.custom.js';
//import { CatchurlAgent } from './agents/CatchurlAgent.js'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SpoggyRdflib extends LitElement {
  render() {
    //  const { _test } = this;
    return html`

    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>
    ${this._test} pour tester <span>rdflib</span><br>
    https://github.com/linkeddata/rdflib.js/<br>
    https://github.com/solid/solid-tutorial-rdflib.js/issues/4<br>
    https://www.npmjs.com/package/rdflib<br>
    https://github.com/solid/solid-tutorial-rdflib.js<br>





    `;
  }

  static get properties() { return {
    _test: String,

  }};

  constructor() {
    super();
    this._test = "bidule";

    // SOLID TUTORIAL https://github.com/solid/solid-tutorial-rdflib.js
    console.log($rdf);

    this.RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
    this.RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
    this.FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
    this.XSD = $rdf.Namespace("http://www.w3.org/2001/XMLSchema#");



    //var uri = 'https://example.org/resource.ttl';
    //  var uri = 'https://raw.githubusercontent.com/scenaristeur/spoggy-graph/master/data/pizza.owl';
    //  var uri = 'http://www.iro.umontreal.ca/~lapalme/ift6282/RDF/IFT6282_0.ttl';
    var uri = 'http://127.0.0.1:8081/data/pizza.owl'

    var body = '<a> <b> <c> .'
    //var mimeType = 'text/turtle'
    var mimeType='application/rdf+xml'
    var store = $rdf.graph()

    try {
      var result = $rdf.parse(body, store, uri, mimeType)
      console.log("ok")
      console.log(store.statements) // shows the parsed statements
      /*.then(function(data){
      console.log(data)
    });*/
  } catch (err) {
    console.log("err")
    console.log(err)
  }

  var me = $rdf.sym('https://www.w3.org/People/Berners-Lee/card#i');
  var knows = this.FOAF('knows')
  var friend = store.any(me, knows)  // Any one person
  console.log(friend)


}

firstUpdated(){
  //  console.log("update");
  //  console.log("eve",eve);
  //  this.agentCatchurl = new CatchurlAgent('agentCatchurl', this);
  //  console.log(this.agentCatchurl);
  //  this.agentCatchurl.send('agentApp', {type: 'dispo', name: 'agentCatchurl' });
  //  console.log("catchurl");
  this._test = "test spoggy-rdflib"
}



}

window.customElements.define('spoggy-rdflib', SpoggyRdflib);
