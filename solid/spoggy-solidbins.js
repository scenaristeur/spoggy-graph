//https://solid.inrupt.com/docs/manipulating-ld-with-rdflib


//https://github.com/solid/solid-tutorial-intro
//http://rhiaro.github.io/sws/
//https://github.com/solid/solid-tutorial-rdflib.js
//https://github.com/solid/solid-platform
//https://github.com/solid/solid-apps

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
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
// These are the elements needed by this element.
//import { plusIcon, minusIcon } from './../my-icons.js';

// These are the shared styles needed by this element.
//import { ButtonSharedStyles } from './../button-shared-styles.js';
//import  '/node_modules/evejs/dist/eve.custom.js';
//import { CatchurlAgent } from './agents/CatchurlAgent.js'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.

/*<import '../lib/rdflib.js';*/
import '../lib/solid-auth-client.bundle.js';

class SpoggySolidbins extends LitElement {
  render() {
    //  const { _test } = this;
    return html`

    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>
    ${this._test}
    <h2> SOLID BINS</h2>

    <paper-input
    id="inputSolid"
    label="Solid Profil :"
    value="https://smag0.solid.community/">
    </paper-input>
    <p>
    <paper-button id="solidLogin" raised @click="${(e) =>  this._solid_login(e)}">Login</paper-button>
    </p>
    <p>
    <paper-button id="solidLogout" raised @click="${(e) =>  this._solid_logout(e)}">Logout</paper-button>
    </p>


    <div class="content center-text hidden" id="view">
    <h1 id="view-title"></h1>
    <br>
    <div id="view-body"></div>
    </div>

    <div class="content center-text hidden" id="edit">
    <input type="text" id="edit-title" class="block" placeholder="Title...">
    <br>
    <textarea id="edit-body" class="block" placeholder="Paste text here..."></textarea>
    <br>
    <!--<button id="submit" class="btn">Publish</button>-->
    <paper-button id="submit" class="btn" raised @click="${() =>  this._publish()}">Publish</paper-button>
    </div>

    `;
  }

  static get properties() { return {
    _test: String,
    _bin: Object,
    _defaultContainer: String
  }};

  constructor() {
    super();
    this._test = "bidule",
    // Bin structure
    this._bin  = {
      url: 'url1',
      title: 'title1',
      body: 'body1'
    }
    //this._defaultContainer = 'https://user.databox.me/Public/bins/' ;
    this._defaultContainer = 'https://smag0.solid.community/public/bins'; // https://smag0.solid.community/profile/card#me
    console.log($rdf);
    console.log(solid)
    this.VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    this.FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
  }


  _solid_login(e){
    console.log(solid);
    // Log the user in and out on click
    const popupUri = 'popup.html';
    solid.auth.popupLogin({ popupUri });


  }

  _solid_logout(e){
    solid.auth.logout();
    this._clearSolidResults();
  }

  _clearSolidResults(){
    /*while( this._friends.firstChild ){
    this._friends.removeChild( this._friends.firstChild );
  }
  while( this._friendsError.firstChild ){
  this._friendsError.removeChild( this._friendsError.firstChild );
}*/
}
//create
//view
//edit
_publish () {
  var vocab = solid.vocab;
  this._bin.title = this.shadowRoot.getElementById('edit-title').value
  this._bin.body = this.shadowRoot.getElementById('edit-body').value

  console.log(this.store)
  console.log(this.updateManager)
  var uri = "https://smag0.solid.community/public/bins/test";
  var thisResource = $rdf.sym(uri)
  console.log(thisResource)

  /* $rdf.bnode is not a function
  var blankNode = $rdf.bnode()
  console.log(blankNode)*/

  /*var graph = $rdf.graph()
  console.log(graph)
  var thisResource = $rdf.sym('')
  console.log(thisResource)*/
  this.store.add(thisResource, this.FOAF('name'), $rdf.lit(this._bin.title))
  console.log(this.store)
  this.store.add(thisResource, this.VCARD('role'), $rdf.lit(this._bin.body))
  console.log(this.store)
  var data = new $rdf.Serializer(this.store).toN3(this.store)
  console.log(data)
  var doc = "doc ?"

  var person = thisResource;
  var name = $rdf.lit(this._bin.title);
  let ins = $rdf.st(person, this.VCARD('fn'), name, doc)
  let del = []

  //const updater = new $rdf.UpdateManager(this.store);
  this.updateManager.update(del, ins, (uri, ok, message) => {
    if (ok) console.log('Name changed to '+ name)
    else console.log(message)
  })

  /*solid.web.post(this._defaultContainer, data).then(function(meta) {
  // view
  window.location.search = "?view="+encodeURIComponent(meta.url)
}).catch(function(err) {
// do something with the error
console.log(err)
});*/
}



firstUpdated(){
  //  console.log("update");
  //  console.log("eve",eve);
  //  this.agentCatchurl = new CatchurlAgent('agentCatchurl', this);
  //  console.log(this.agentCatchurl);
  //  this.agentCatchurl.send('agentApp', {type: 'dispo', name: 'agentCatchurl' });
  //  console.log("catchurl");
  this._test = "test spoggy-solidbins"
  console.log(this._defaultContainer, this._bin);
  //  console.log(solid)
  this._inputSolid = this.shadowRoot.getElementById('inputSolid');
  this._solidLoginBtn = this.shadowRoot.getElementById('solidLogin');
  this._solidLogoutBtn = this.shadowRoot.getElementById('solidLogout');
  solid.auth.trackSession(session => {
    const loggedIn = !!session;


    if (loggedIn){
      this._solidLoginBtn.style.visibility="hidden";
      this._solidLogoutBtn.style.visibility="visible";
      //  this._card.style.visibility="visible";
      this._inputSolid.value = session.webId;
      console.log(session.webId)
      this.session = session;
      // Update components to match the user's login status
      this.FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

      // Set up a local data store and associated data fetcher
      this.store = $rdf.graph();
      this.fetcher = new $rdf.Fetcher(this.store);
      this.updateManager = new $rdf.UpdateManager(this.store);
      //  this.loadProfile();
      console.log(this.store)
    }else{
      this._solidLoginBtn.style.visibility="visible";
      this._solidLogoutBtn.style.visibility="hidden";
      //  this._card.style.visibility="hidden";
      this._inputSolid.value = "";
    }
  });

}



}

window.customElements.define('spoggy-solidbins', SpoggySolidbins);
