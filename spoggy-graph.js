import {LitElement, html} from '@polymer/lit-element';
//import {Network} from 'vis/dist/vis.js';
import  'vis/dist/vis.js';
import  'evejs/dist/eve.min.js';
import { GraphAgent } from './agents/GraphAgent.js'
import { ttl2Xml, rdf2Xml } from './lib/import-export.js'
import { catchTriplet } from './lib/graphBehavior.js'
import "./spoggy-input.js";

import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';
import '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';
import '@polymer/paper-checkbox/paper-checkbox.js';

class SpoggyGraph extends LitElement {

  render() {
    const { data } = this;
    return html`
    <style>
    .source { color: green; }

    #mynetwork {
      top: 0;
      left: 0;
      width: 100%;
      height: 50vh; /*height: 90vh;*/
      bottom: 0px  !important;;
      border: 1px solid lightgray;
      background: linear-gradient(to bottom, rgba(55, 55, 255, 0.2), rgba(200, 200, 10, 0.2));
    }
    #operation {
      font-size:28px;
    }
    #node-popUp {
      display:none;
      position:absolute;
      /*  top:350px;
      left:170px; */
      z-index:299;
      width:250px;
      height:120px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    #edge-popUp {
      display:none;
      position:absolute;
      /*    top:350px;
      left:170px; */
      z-index:299;
      width:250px;
      height:90px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    .popup {
      position: absolute;
      z-index: 10;
      top: 2vw;
      left: 2vw;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:1px;
    }

    div.vis-network div.vis-manipulation {
      box-sizing: content-box;
      border-width: 0;
      border-bottom: 1px;
      border-style:solid;
      border-color: #d6d9d8;
      background: #ffffff; /* Old browsers */
      background: -moz-linear-gradient(top,  #ffffff 0%, #fcfcfc 48%, #fafafa 50%, #fcfcfc 100%); /* FF3.6+ */
      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(48%,#fcfcfc), color-stop(50%,#fafafa), color-stop(100%,#fcfcfc)); /* Chrome,Safari4+ */
      background: -webkit-linear-gradient(top,  #ffffff 0%,#fcfcfc 48%,#fafafa 50%,#fcfcfc 100%); /* Chrome10+,Safari5.1+ */
      background: -o-linear-gradient(top,  #ffffff 0%,#fcfcfc 48%,#fafafa 50%,#fcfcfc 100%); /* Opera 11.10+ */
      background: -ms-linear-gradient(top,  #ffffff 0%,#fcfcfc 48%,#fafafa 50%,#fcfcfc 100%); /* IE10+ */
      background: linear-gradient(to bottom,  #ffffff 0%,#fcfcfc 48%,#fafafa 50%,#fcfcfc 100%); /* W3C */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#fcfcfc',GradientType=0 ); /* IE6-9 */
      padding-top:4px;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 28px;
    }
    div.vis-network div.vis-edit-mode {
      position:absolute;
      left: 0;
      top: 5px;
      height: 30px;
    }
    /* FIXME: shouldn't the vis-close button be a child of the vis-manipulation div? */
    div.vis-network div.vis-close {
      position:absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background-position: 20px 3px;
      background-repeat: no-repeat;
      background-image: url("../node_modules/vis/dist/img/network/cross.png");
      cursor: pointer;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    div.vis-network div.vis-close:hover {
      opacity: 0.6;
    }
    div.vis-network div.vis-manipulation div.vis-button,
    div.vis-network div.vis-edit-mode div.vis-button {
      float:left;
      font-family: verdana;
      font-size: 12px;
      -moz-border-radius: 15px;
      border-radius: 15px;
      display:inline-block;
      background-position: 0px 0px;
      background-repeat:no-repeat;
      height:24px;
      /*  margin-left: 10px; */
      /*vertical-align:middle;*/
      cursor: pointer;
      padding: 0px 8px 0px 8px;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    div.vis-network div.vis-manipulation div.vis-button:hover {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.20);
    }
    div.vis-network div.vis-manipulation div.vis-button:active {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.50);
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-back {
      background-image: url("../node_modules/vis/dist/img/network/backIcon.png");
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-none:hover {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.0);
      cursor: default;
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-none:active {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.0);
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-none {
      padding: 0;
    }
    div.vis-network div.vis-manipulation div.notification {
      margin: 2px;
      font-weight: bold;
    }
    div.vis-network div.vis-manipulation div.vis-button {
      background-color:#0D578B;
      color:white;
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-add {
      background-image: url("../node_modules/vis/dist/img/network/addNodeIcon.png");
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-edit,
    div.vis-network div.vis-edit-mode div.vis-button.vis-edit {
      background-image: url("../node_modules/vis/dist/img/network/editIcon.png");
    }
    div.vis-network div.vis-edit-mode div.vis-button.vis-edit.vis-edit-mode {
      background-color: #fcfcfc;
      border: 1px solid #cccccc;
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-connect {
      background-image: url("../node_modules/vis/dist/img/network/connectIcon.png");
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-delete {
      background-image: url("../node_modules/vis/dist/img/network/deleteIcon.png");
    }
    /* top right bottom left */
    div.vis-network div.vis-manipulation div.vis-label,
    div.vis-network div.vis-edit-mode div.vis-label {
      margin: 0 0 0 23px;
      line-height: 25px;
    }
    div.vis-network div.vis-manipulation div.vis-separator-line {
      float:left;
      display:inline-block;
      width:1px;
      height:21px;
      background-color: #bdbdbd;
      margin: 0px 1px 0 1px;
      /*  margin: 0px 7px 0 15px;*/ /*top right bottom left*/
    }
    div.vis-network div.vis-navigation div.vis-button {
      width:34px;
      height:34px;
      -moz-border-radius: 17px;
      border-radius: 17px;
      position:absolute;
      display:inline-block;
      background-position: 2px 2px;
      background-repeat:no-repeat;
      cursor: pointer;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    div.vis-network div.vis-navigation div.vis-button:hover {
      box-shadow: 0 0 3px 3px rgba(56, 207, 21, 0.30);
    }
    div.vis-network div.vis-navigation div.vis-button:active {
      box-shadow: 0 0 1px 3px rgba(56, 207, 21, 0.95);
    }
    div.vis-network div.vis-navigation div.vis-button.vis-up {
      background-image: url("../node_modules/vis/dist/img/network/upArrow.png");
      bottom:50px;
      left:55px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-down {
      background-image: url("../node_modules/vis/dist/img/network/downArrow.png");
      bottom:10px;
      left:55px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-left {
      background-image: url("../node_modules/vis/dist/img/network/leftArrow.png");
      bottom:10px;
      left:15px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-right {
      background-image: url("../node_modules/vis/dist/img/network/rightArrow.png");
      bottom:10px;
      left:95px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-zoomIn {
      background-image: url("../node_modules/vis/dist/img/network/plus.png");
      bottom:10px;
      right:15px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-zoomOut {
      background-image: url("../node_modules/vis/dist/img/network/minus.png");
      bottom:10px;
      right:55px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-zoomExtends {
      background-image: url("../node_modules/vis/dist/img/network/zoomExtends.png");
      bottom:50px;
      right:15px;
    }
    </style>

    <paper-dialog id="import-popUp" class="popup" backdrop transition="core-transition-bottom"><!--  on-iron-overlay-opened="_openImport"
    on-iron-overlay-closed="_closeImport"-->
    <div horizontal start-justified start layout >
    <core-icon icon="thumb-up" style="height: 150px; width:150px;color: #0D578B;"></core-icon>
    <div style="padding-left:20px" vertical start-justified start layout wrap>
    <h2 id="importOperation" style="margin: 0;color: #0D578B;">Import JSON (ou ttl) <paper-icon-button icon="clear" dialog-dismiss></paper-icon-button></h2>
    <p >
    <fieldset>
    <legend>Paramètres</legend>
    <paper-checkbox id="remplaceNetwork">Remplacer Network</paper-checkbox>
    <paper-checkbox id="partageImport" disabled >Partager Import</paper-checkbox>
    </fieldset>
    </p>
    <p>
    <fieldset>
    <legend>Fichier</legend>
    <input id="filepicker"
    type="file"
    multiple value="Importer"
    @change="${(e) =>  this.handleFileSelected(e)}"></input>
    </fieldset>
    </p>
    <div style="padding-top:10px" horizontal end-justified layout self-stretch>
    <paper-button id="importCancelButton" dialog-dismiss raised>Annuler</paper-button>
    <a href="https://github.com/scenaristeur/heroku-spoggy/tree/master/public/exemple_files" target="_blank"> exemples de fichiers spoggy </a>
    </div>
    </div>
    </div>
    </paper-dialog>


    <div id="node-popUp">
    <span id="node-operation">node</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>id</td><td><input id="node-id" value="" /></td>
    </tr>
    <tr>
    <td>Label</td><td><input id="node-label" value="" autofocus /></td>
    </tr>
    </table>
    <input type="button" value="save" id="node-saveButton" />
    <input type="button" value="cancel" id="node-cancelButton" />
    </div>

    <div id="edge-popUp">
    <span id="edge-operation">edge</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>Label</td><td><input id="edge-label" value="" autofocus /></td>
    </tr></table>
    <input type="button" value="save" id="edge-saveButton" />
    <input type="button" value="cancel" id="edge-cancelButton" />
    </div>
    <br>

    <spoggy-input destinataire="${this.id}"></spoggy-input>
    <div id="mynetwork"></div>
    `;
  }


  static get properties() {
    return {
      id: {type: String, value:""},
      name: {type: String, value: ""},
      source: {type: String, value: ""},
      data: {type: Object, value: {}}
    };
  }

  constructor() {
    super();

    //  this.id = "noid";
    //  this.name = "anonymous";
    //  this.source = "nosource";
  }

  updated(data){
    //  super.updated(data)
    console.log("updated", data);
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

}

update(data) {
  super.update(data);
  console.log('update', data);
  var dataset =  JSON.stringify(eval("(" + this.data + ")"));
  if (dataset != undefined){
    dataset = JSON.parse(dataset);
    this.network.body.data.nodes.update(dataset.nodes);
    this.network.body.data.edges.update(dataset.edges);
  }
}

firstUpdated() {
  //  super.firstUpdated()
  //  console.log("vis",vis);

  console.log('------------name : ', this.name, 'id : ', this.id);
  this.agentGraph = new GraphAgent(this.id, this);
  //  console.log(this.agentGraph);
  this.agentGraph.send('agentApp', {type: 'dispo', name: this.id });
  // create a network
  //  var container = document.getElementById('mynetwork');


  var seed = 2;
  var app = this;

  // create an array with nodes
  var nodes = new vis.DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 22'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
  ]);

  // create an array with edges
  var edges = new vis.DataSet([
    {from: 1, to: 3, arrows:'to'},
    {from: 1, to: 2, arrows:'to'},
    {from: 2, to: 4, arrows:'to'},
    {from: 2, to: 5, arrows:'to'},
    {from: 3, to: 3, arrows:'to'}
  ]);


  var data = {
    nodes: nodes,
    edges: edges
  };
  var defaultLocal = navigator.language;
  //  console.log(defaultLocal);
  //  app.setDefaultLocale();
  var container = this.shadowRoot.getElementById('mynetwork');

  var options = {
    layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
    //  locale: this._root.querySelector('#locale').value,
    edges:{
      arrows: {
        to:     {enabled: true, scaleFactor:1, type:'arrow'},
        middle: {enabled: false, scaleFactor:1, type:'arrow'},
        from:   {enabled: false, scaleFactor:1, type:'arrow'}
      }},
      interaction:{
        navigationButtons: true,
        //  keyboard: true  //incompatible avec rappel de commande en cours d'implémentation
        multiselect: true,
      },
      manipulation: {
        addNode: function (data, callback) {
          // filling in the popup DOM elements
          app.shadowRoot.getElementById('node-operation').innerHTML = "Add Node";
          app.editNode(data, app.clearNodePopUp, callback);
        },
        editNode: function (data, callback) {
          // filling in the popup DOM elements
          app.shadowRoot.getElementById('node-operation').innerHTML = "Edit Node";
          app.editNode(data, app.cancelNodeEdit, callback);
        },
        addEdge: function (data, callback) {
          if (data.from == data.to) {
            var r = confirm("Do you want to connect the node to itself?");
            if (r != true) {
              callback(null);
              return;
            }
          }
          app.shadowRoot.getElementById('edge-operation').innerHTML = "Add Edge";
          app.editEdgeWithoutDrag(data, callback);
        },
        editEdge: {
          editWithoutDrag: function(data, callback) {
            app.shadowRoot.getElementById('edge-operation').innerHTML = "Edit Edge";
            app.editEdgeWithoutDrag(data,callback);
          }
        }
      }
    };

    app.network = new vis.Network(container, data, options);
    app.network.on("selectNode", function (params) {
      console.log('selectNode Event: ', params);
    });
    console.log(app.network)

  }


  editNode(data, cancelAction, callback) {
    this.shadowRoot.getElementById('node-label').value = data.label ;
    this.shadowRoot.getElementById('node-saveButton').onclick = this.saveNodeData.bind(this, data, callback);
    this.shadowRoot.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
    this.shadowRoot.getElementById('node-popUp').style.display = 'block';
  }

  // Callback passed as parameter is ignored
  clearNodePopUp() {
    this.shadowRoot.getElementById('node-saveButton').onclick = null;
    this.shadowRoot.getElementById('node-cancelButton').onclick = null;
    this.shadowRoot.getElementById('node-popUp').style.display = 'none';
  }

  cancelNodeEdit(callback) {
    this.clearNodePopUp();
    callback(null);
  }

  saveNodeData(data, callback) {
    data.label =  this.shadowRoot.getElementById('node-label').value;
    this.clearNodePopUp();
    callback(data);
  }

  editEdgeWithoutDrag(data, callback) {
    // filling in the popup DOM elements
    this.shadowRoot.getElementById('edge-label').value = data.label || "";
    this.shadowRoot.getElementById('edge-saveButton').onclick = this.saveEdgeData.bind(this, data, callback);
    this.shadowRoot.getElementById('edge-cancelButton').onclick = this.cancelEdgeEdit.bind(this,callback);
    this.shadowRoot.getElementById('edge-popUp').style.display = 'block';
  }

  clearEdgePopUp() {
    this.shadowRoot.getElementById('edge-saveButton').onclick = null;
    this.shadowRoot.getElementById('edge-cancelButton').onclick = null;
    this.shadowRoot.getElementById('edge-popUp').style.display = 'none';
  }

  cancelEdgeEdit(callback) {
    this.clearEdgePopUp();
    callback(null);
  }

  saveEdgeData(data, callback) {
    if (typeof data.to === 'object')
    data.to = data.to.id
    if (typeof data.from === 'object')
    data.from = data.from.id
    data.label = this.shadowRoot.getElementById('edge-label').value;
    this.clearEdgePopUp();
    callback(data);
  }

  setDefaultLocale() {
    var defaultLocal = navigator.language;
    var select = this.shadowRoot.getElementById('locale');
    select.selectedIndex = 0; // set fallback value
    for (var i = 0, j = select.options.length; i < j; ++i) {
      if (select.options[i].getAttribute('value') === defaultLocal) {
        select.selectedIndex = i;
        break;
      }
    }
  }
  /////////////////////////////////////
  tripletToNetwork(triplet){
    console.log(triplet)
    var actionstosend = catchTriplet(triplet, this.network)
    console.log(actionstosend);
    this.agentGraph.send('agentFuseki', {type: "newActions", actions: actionstosend});
  }

  exportJson() {
    var network = this.network;
    console.log(network)
    var filename = prompt("Sous quel nom sauvegarder ce graphe ?", "Spoggy");
    //  app.$.inputMessage.value = '';
    if (filename == null || filename == "") {
      txt = "User cancelled the prompt.";
      return;
    }
    var textToWrite = "";
    var fileNameToSaveAs = filename+"_spoggy_nodes_edges_" + Date.now() + ".json";
    var textFileAsBlob = "";

    console.log("export Json");
    console.log(network.body.data);
    var nodes_edges = { nodes: network.body.data.nodes.get(), edges: network.body.data.edges.get() };
    console.log(nodes_edges);
    var nodes_edgesJSON = JSON.stringify(nodes_edges);
    console.log(nodes_edgesJSON);
    textFileAsBlob = new Blob([nodes_edgesJSON], {
      type:
      'application/json'
    }
  );
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if(navigator.userAgent.indexOf("Chrome") != -1)
  {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    console.log("CHROME");
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  } else
  {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    console.log("FF");
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.target="_blank";
    //downloadLink.onclick = destroyClickedElement;
    //downloadLink.onclick = window.URL.revokeObjectURL(downloadLink);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    //  console.log(app.$.popupTtl);
  }
  console.log(downloadLink);
  /*downloadLink.click();*/
  /* creation d'un event car download.click() ne fonctionne pas sous Firefox */
  var event = document.createEvent("MouseEvents");
  event.initMouseEvent(
    "click", true, false, window, 0, 0, 0, 0, 0
    , false, false, false, false, 0, null
  );
  downloadLink.dispatchEvent(event);
  var app = this;
  setTimeout(function(){
    console.log(downloadLink.parentNode);
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadLink);
  }, 1000);
  /*if (window.URL != null) {
  // Chrome allows the link to be clicked
  // without actually adding it to the DOM.
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
} else {
// Firefox requires the link to be added to the DOM
// before it can be clicked.
downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
downloadLink.onclick = destroyClickedElement;
downloadLink.style.display = "none";
document.body.appendChild(downloadLink);
}
downloadLink.click();*/
}



exportTtl() {
  /* source https://github.com/scenaristeur/dreamcatcherAutonome/blob/master/autonome/public/agents/ExportAgent.js */
  let network = this.network;
  var nodes = network.body.data.nodes.get();
  var edges = network.body.data.edges.get();
  console.log("exportation");
  console.log(nodes);
  console.log(edges);
  //creation des statements (triplets)
  /*var statements = [];
  for (var j = 0; j < edges.length; j++){
  var edge = edges[j];
  console.log(edge);
  statements.push({sujet: node.id, propriete: "rdfs:label", objet: node.label});
}
console.log(statements);*/

var output = "@prefix : <http://smag0.blogspot.fr/spoggy#> . \n";
output += "@prefix owl: <http://www.w3.org/2002/07/owl#> . \n";
output += "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . \n";
output += "@prefix xml: <http://www.w3.org/XML/1998/namespace> . \n";
output += "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> . \n";
output += "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . \n";
output += "@prefix smag: <http://smag0.blogspot.fr/spoggy#> . \n";
output += "@base <http://smag0.blogspot.fr/spoggy> . \n";
output += "<http://smag0.blogspot.fr/spoggy> rdf:type owl:Ontology ;  \n";
output += "                    owl:versionIRI <http://smag0.blogspot.fr/spoggy/1.0.0> . \n";
output += " \n";
output += "owl:Class rdfs:subClassOf owl:Thing .  \n";

var listeInfos = new Array();
var listeComplementaire = new Array();

for (var i = 0; i < edges.length; i++) {
  var edge = edges[i];

  var sujet = edge.from;
  var propriete = edge.label;
  var objet = edge.to;


  //string.indexOf(substring) > -1
  //console.log(sujet);
  //console.log(propriete);
  //  console.log(objet);

  // AJOUTER EVENTUELLEMENT LA RECUPERATION DE SHAPE, COLOR, pour l'export RDF
  var sujetLabel = network.body.data.nodes.get(sujet).label;
  var objetLabel = network.body.data.nodes.get(objet).label;
  //console.log("#########################");
  //console.log(sujetLabel);
  //console.log(objetLabel)
  //console.log("#########################");

  var sujetWithPrefix = this.validRdf(network, sujet);
  var proprieteWithPrefix = this.validRdf(network, propriete);
  var objetWithPrefix = this.validRdf(network, objet);

  if (sujetWithPrefix.indexOf(':') == -1) { // ne contient pas de ':'
  sujetWithPrefix = ':' + sujetWithPrefix;
}

if (proprieteWithPrefix.indexOf(':') == -1) { // ne contient pas de ':'
proprieteWithPrefix = ':' + proprieteWithPrefix;

}

if (objetWithPrefix.indexOf(':') == -1) { // ne contient pas de ':'
objetWithPrefix = ':' + objetWithPrefix;
}


var typedeProp = ["owl:AnnotationProperty", "owl:ObjectProperty", "owl:DatatypeProperty"];
var indiceTypeDeProp = 1; // -1 pour ne pas ajouter la prop, sinon par defaut en annotationProperty, 1 pour Object, 2 pour Datatype --> revoir pour les datatypes

if (
  (proprieteWithPrefix == "type") ||
  (proprieteWithPrefix == ":type") ||
  (proprieteWithPrefix == "rdf:type") ||
  (proprieteWithPrefix == ":a") ||
  (proprieteWithPrefix == ":est_un") ||
  (proprieteWithPrefix == ":est_une") ||
  (proprieteWithPrefix == ":is_a")
) {
  proprieteWithPrefix = "rdf:type";
  listeComplementaire.push(objetWithPrefix + " rdf:type owl:Class . \n");
  indiceTypeDeProp = 1;
} else if ((proprieteWithPrefix == "subClassOf") || (proprieteWithPrefix == ":subClassOf") || (proprieteWithPrefix == "rdfs:subClassOf")) {
  proprieteWithPrefix = "rdfs:subClassOf";
}
else if ((proprieteWithPrefix == "sameAs") || (proprieteWithPrefix == ":sameAs")) {
  proprieteWithPrefix = "owl:sameAs";
  indiceTypeDeProp = -1;
}
else if (
  (proprieteWithPrefix.toLowerCase() == "ispartof") ||
  (proprieteWithPrefix.toLowerCase() == "partof") ||
  (proprieteWithPrefix.toLowerCase() == ":partof") ||
  (proprieteWithPrefix.toLowerCase() == ":ispartof")) {
    proprieteWithPrefix = "smag:partOf";
    indiceTypeDeProp = 1;
  } else if (
    (proprieteWithPrefix.toLowerCase() == "comment") ||
    (proprieteWithPrefix.toLowerCase() == "commentaire") ||
    (proprieteWithPrefix.toLowerCase() == "//") ||
    (proprieteWithPrefix.toLowerCase() == "#")
  ) {
    proprieteWithPrefix = "rdfs:comment";
    indiceTypeDeProp = -1;
  }
  if (indiceTypeDeProp >= 0) {
    listeComplementaire.push(proprieteWithPrefix + " rdf:type " + typedeProp[indiceTypeDeProp] + " . \n");
  }
  var data = sujetWithPrefix + " " + proprieteWithPrefix + " " + objetWithPrefix + " . \n";
  data += sujetWithPrefix + " " + "rdfs:label \"" + sujetLabel + "\" . \n";
  data += objetWithPrefix + " " + "rdfs:label \"" + objetLabel + "\" . \n";
  listeInfos[i] = data;
  console.log(data);
  console.log("||||||||||||||||||||||--");
}
//console.log(listeInfos);
//console.log(listeComplementaire);
//suppression des doublons
listeInfos = this.uniq_fast(listeInfos.sort());
listeComplementaire = this.uniq_fast(listeComplementaire.sort());
// console.log (listeInfos);
for (var k = 0; k < listeInfos.length; k++) {
  output = output + listeInfos[k];
  //  console.log(output);
}

for (var l = 0; l < listeComplementaire.length; l++) {
  output = output + listeComplementaire[l];
  //  console.log(output);
}

//this.$.dialogs.$.inputTextToSave.value = output; //     document.getElementById("inputTextToSave").value =output;
/*this.$.dialogs.$.popupTtl.fitInto = this.$.dialogs.$.menu;*/
//this.$.dialogs.$.popupTtl.toggle();
console.log(output)

this.agentGraph.send('agentDialogs', {type:'exportTtl', ttlData : output});
}

uniq_fast(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
    var item = a[i];
    if(seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}

importJson(){
  console.log("import JSON");
  this.shadowRoot.getElementById('import-popUp').style.display = 'block';
}

handleFileSelected(evt) {
  var app = this;
var partageImport = this.shadowRoot.getElementById('partageImport').checked;
  var remplaceNetwork = this.shadowRoot.getElementById('remplaceNetwork').checked;

  var files = evt.target.files; // FileList object
  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0; i < files.length; i++) {
    // Code to execute for every file selected
    var fichier = files[i];
    console.log(fichier);
  //  this.agentDialogs.send('agentGraph', {type: 'decortiqueFile', fichier: fichier, remplaceNetwork: remplaceNetwork});
        this.decortiqueFile(fichier,  remplaceNetwork); //this.network,
  }
  console.log("fin");
  // Code to execute after that
  evt.target.files = null;
  //app.$.importPopUp.toggle();
  this.shadowRoot.getElementById('import-popUp').style.display = 'none';
  //  app.$.dialogs.$.inputMessage.value = '';
}

decortiqueFile(fichier, remplaceNetwork){
  //  var network = network;
  //  console.log(network);
  let network = this.network;
  //  console.log(fichier);
  var reader = new FileReader(); //https://openclassrooms.com/courses/dynamisez-vos-sites-web-avec-javascript/l-api-file
  reader.addEventListener('load', function () {
    //  console.log(fichier);
    /*loadstart : La lecture vient de commencer.
    progress : Tout comme avec les objets XHR, l'événement progress se déclenche à intervalles réguliers durant la progression de la lecture. Il fournit, lui aussi, un objet en paramètre possédant deux propriétés, loaded et total, indiquant respectivement le nombre d'octets lus et le nombre d'octets à lire en tout.
    load : La lecture vient de se terminer avec succès.
    loadend : La lecture vient de se terminer (avec ou sans succès).
    abort : Se déclenche quand la lecture est interrompue (avec la méthode abort() par exemple).
    error : Se déclenche quand une erreur a été rencontrée. La propriété error contiendra alors un objet de type FileError pouvant vous fournir plus d'informations.*/
    //    console.log(this.result);
    //alert('Contenu du fichier "' + fichier.name + '" :\n\n' + reader.result);


    switch (fichier.type) {
      case "":
      case "text/plain":
      case "application/json":
      //    console.log("JSON");
      //  thisElement.dispatch('addNodesEdgesJSON', JSON.parse(reader.result));
      //    console.log(network);
      var nodes = JSON.parse(reader.result).nodes;
      //    console.log(nodes);
      var edges = JSON.parse(reader.result).edges;
      //    console.log(edges);
      network.beforeImport = [];
      network.beforeImport.nodes = network.body.data.nodes.get();
      network.beforeImport.edges = network.body.data.edges.get();
      network.body.data.nodes.update(nodes);
      network.body.data.edges.update(edges);
      if(remplaceNetwork){
        console.log(remplaceNetwork);
        network.body.data.nodes.clear();
        network.body.data.edges.clear();
        console.log("clear");
        network.body.data.nodes.add(nodes); // clear() ne semble pas fonctionner, à revoir
        network.body.data.edges.add(edges);
        console.log(network);
      }else{

        try{
          network.body.data.nodes.update(nodes);
          network.body.data.edges.update(edges);
        }
        catch(e){
          console.log(e);
        }
      }
      console.log(network);
      //  console.log(partageImport);
      break;
      case "rdf+xml":
      case "application/rdf+xml":
      console.log("fichier RDF"); //https://github.com/scenaristeur/dreamcatcherAutonome/blob/8376cb5211095a90314e34e9d286b820fbed335b/autonome1/public/agents/FichierAgent.js
      rdf2Xml(reader.result, network);
      //  network.dispatch('addTriplets', network.triplets);// CREER UNE NOUVELLE ACTION POUR ENVOYER TS LES TRIPLETS
      break;
      case "turtle":
      case "text/turtle":
      case "application/turtle":
      console.log("fichier turtle");
      console.log("ce type de fichier n'est pas pris en compte (" + fichier.type + ")");
      ttl2Xml(reader.result, network);
      //network.dispatch('addTriplets', network.triplets);
      break;
      default:
      console.log("ce type de fichier n'est pas pris en compte (" + fichier.type + ")");
      var extension = fichier.name.split('.').pop();
      console.log(extension);
      console.log(fichier);
      //  console.log(reader.result);
      if ((extension == "ttl") || (extension == "n3") || (extension == "n3t")) {
        //   sketch.ttl2Xml(reader.result);
        ttl2Xml(reader.result, network);
        //  network.dispatch('addTriplets', network.triplets);
      } else if ((extension == "rdf") || (extension == "owl")) {
        //  sketch.data2Xml(reader.result); //if srdf
        rdf2Xml(reader.result, network);
        //  network.dispatch('addTriplets', network.triplets);
      }
      else if ((extension == "json") || (reader.result.startsWith("[{"))) {
        // json2Xml(reader.result);
        //  network.dispatch('addNodesEdgesJSON', JSON.parse(reader.result));
      } else {
        data2Xml(reader.result, network);
      }
      console.log("fichier lu");
    }

    // thisApp.dispatch('update_triplets2add', this.triplets2add);

  });
  console.log(fichier);

  reader.readAsText(fichier);
}



}

customElements.define('spoggy-graph', SpoggyGraph);
