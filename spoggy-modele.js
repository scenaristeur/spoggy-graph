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
class SpoggyModele extends LitElement {
  render() {
    //  const { _test } = this;
    return html`

    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>
    ${this._test}
    `;
  }

  static get properties() { return {
    _test: String
  }};

  constructor() {
    super();
    this._test = "bidule"

  }

  firstUpdated(){
    //  console.log("update");
    //  console.log("eve",eve);
  //  this.agentCatchurl = new CatchurlAgent('agentCatchurl', this);
  //  console.log(this.agentCatchurl);
  //  this.agentCatchurl.send('agentApp', {type: 'dispo', name: 'agentCatchurl' });
  //  console.log("catchurl");
  this._test = "test spoggy-modele"
  }



}

window.customElements.define('spoggy-modele', SpoggyModele);
