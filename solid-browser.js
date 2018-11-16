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
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
// These are the elements needed by this element.
//import { plusIcon, minusIcon } from './../my-icons.js';

// These are the shared styles needed by this element.
//import { ButtonSharedStyles } from './../button-shared-styles.js';
import  '/node_modules/evejs/dist/eve.custom.js';
//import { CatchurlAgent } from './agents/CatchurlAgent.js'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SolidBrowser extends LitElement {
  render() {
    //  const { _test } = this;
    return html`

    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>
    <style>
    #filesList {
      background: #ff9999;
      padding: 20px;
    }

    ul {
      background: #3399ff;
      padding: 20px;
    }

    #filesList li {
      background: #ffe5e5;
      padding: 5px;
      margin-left: 35px;
    }

    ul li {
      list-style-type: none;
      background: #cce5ff;
      margin: 5px;
    }

    /*li:nth-child(even) {
    background: #FF0;
  }
  li:nth-child(odd) {
  background: #CCC;
}*/
</style>
<!--<paper-card heading="Browser" image="http://placehold.it/350x150/FFC107/000000" alt="Browser">-->
<paper-card heading="Browser" >
<div class="card-content">
${this._test}

<div>
<paper-button id="solidLogin"  raised @click="${() =>  this.login()}" >Login</paper-button>
<paper-button id="solidLogout"  raised @click="${() =>  this.logout()}">Logout</paper-button>
<br>
(<a href="https://solid.inrupt.com/get-a-solid-pod" target="_blank"> Get a POD / Obtenir un POD</a>)
</div>




<div id="card">

<table border="1" width="90%">
<tr>
<td >
<paper-input id="podInput" label="POD" type="text" size="100"></paper-input>
<paper-input id="nameInput" label="Name / Nom" type="text" size="100"></paper-input>
</td>
<td align="right">
History / Historique
<ul id="historiqueUl"></ul>
</td>
</tr>
</table>

<paper-button
id="updatePublicFolderBtn"
onclick="updatePublicFolder()">update Public Folder / Actualiser le dossier public
</paper-button>

<table border="1" width="90%">
<tr>
<th >
Public Folders / Dossiers Publics <br>
<paper-input id="newFolderInput" type="text" >
</paper-input>
<paper-button id="addFolderBtn"  onclick="addFolder()">add Folder / Ajouter un dossier</paper-button>
</th>
<th>
Files / Fichiers <br>
<paper-input id="newFileInput" type="text"></paper-input>
<paper-button id="addFileBtn"  onclick="addFile()">add File / Ajouter un fichier</paper-button>
</th>
</tr>
<tr>
<td>

<ul id="foldersList"></ul>
</td>
<td>
<ul id="filesList"></ul>
</td>
</tr>
</table>
</div>

</div>

<div class="card-actions">
<paper-button>Share</paper-button>
<paper-button>Explore!</paper-button>
</div>


</paper-card>



`;
}

static get properties() { return {
  _test: String
}};

constructor() {
  super();
  this._test = "Login to browse your 'Public' Folder / Connectez-vous pour parcourir votre dossier public"
}

firstUpdated(){
  this._podInput = this.shadowRoot.getElementById('podInput');
  this._nameInput = this.shadowRoot.getElementById('nameInput');
  this._solidLoginBtn = this.shadowRoot.getElementById('solidLogin');
  this._solidLogoutBtn = this.shadowRoot.getElementById('solidLogout');
  this._card = this.shadowRoot.getElementById('card');


  //namespaces
  this.FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
  this.LDP = new $rdf.Namespace('http://www.w3.org/ns/ldp#>');
  this.VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');


  var sess, webIdRoot, currentFolder, fetcher, updater;
  var folders = [];
  var files = [];
  var historique = [];
  //  console.log("update");
  //  console.log("eve",eve);
  //  this.agentCatchurl = new CatchurlAgent('agentCatchurl', this);
  //  console.log(this.agentCatchurl);
  //  this.agentCatchurl.send('agentApp', {type: 'dispo', name: 'agentCatchurl' });
  //  console.log("catchurl");

  solid.auth.trackSession(session => {
    this._loggedIn = !!session;


    if (this._loggedIn){
      console.log("LOGGED : ",session.webId)
      this._solidLoginBtn.style.visibility="hidden";
      this._solidLogoutBtn.style.visibility="visible";
      this._card.style.visibility="visible";
      this._podInput.value = session.webId;
      console.log(session.webId)
      this._session = session;
      // Update components to match the user's login status


      // Set up a local data store and associated data fetcher
      this._store = $rdf.graph();
      this._me = this._store.sym(this._session.webId);
      this._profile = this._me.doc() //    i.e. store.sym(''https://example.com/alice/card#me');
      this._fetcher = new $rdf.Fetcher(this._store);
      this._updateManager = new $rdf.UpdateManager(this._store);




      var wedIdSpilt = this._session.webId.split("/");
      this._webIdRoot = wedIdSpilt[0]+"//"+wedIdSpilt[2]+"/";
      console.log(this._webIdRoot);
      this._publicFolder = this._webIdRoot+"public/";
      this._test = this._publicFolder;
      this._updateProfile();
      this.updatePublicFolder(this._publicFolder)
    }else{
      this._solidLoginBtn.style.visibility="visible";
      this._solidLogoutBtn.style.visibility="hidden";
      this._card.style.visibility="hidden";
      this._podInput.value = "";
      this._nameInput.value = "";
    }
  });

}

login(){
  console.log("login")
  console.log(solid);
  // Log the user in and out on click
  const popupUri = 'popup.html';
  solid.auth.popupLogin({ popupUri });
}

logout(){
  console.log("logout")
  solid.auth.logout();
  //  this._clearSolidResults();
}

_updateProfile(){
  console.log("PROFILE UPDATE")
  var app = this;
  this._fetcher.load(this._profile).then(response => {
    console.log(response.responseText)
    console.log("ME : "+app._me)
    let name = app._store.any(app._me, this.VCARD('fn'));
    console.log("Loaded "+name);
    app._nameInput.value = name;
  }, err => {
    console.log("Load failed" +  err);
  });
}

updatePublicFolder(folder){
  if (folder == undefined){
    folder = this._publicFolder;
  }

  console.log("FOLDERS SEARCH ",folder, "WEBIDROOT "+this._webIdRoot )
  console.log("update "+folder)
  console.log(this._loggedIn)
  console.log(this._session.webId)
}


}

window.customElements.define('solid-browser', SolidBrowser);
