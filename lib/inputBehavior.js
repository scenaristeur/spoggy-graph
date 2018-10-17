export function traiteMessage(message){
  var retour = {};
  var inputNew = "";
  message=message.trim();
  let firstChar = message.charAt(0);
  switch(firstChar){
    case '/':
    //    let commande = rdf.quad(rdf.blankNode(), rdf.namedNode('commande'),rdf.literal(message))
    //  this.catchCommande(message,this.network,this);
    this.catchCommande(message, this.network, this);
    inputNew = "";
    break;

    case '.':
    var last = this.commandHistory[this.commandHistory.length-1];
    inputNew = last.s+" "+last.p+" "+last.o;
    break;

    case ';':
    var last = this.commandHistory[this.commandHistory.length-1];
    inputNew = last.s+" "+last.p+" ";
    break;

    case ',':
    var last = this.commandHistory[this.commandHistory.length-1];
    inputNew = last.s+" ";
    break;

    default:
    let lastChar = message.slice(-1);
    let messageCut = message.slice(0,-1).split(" ");
    let isTriplet = true;
    //  console.log(messageCut);

    let detectLiteral = "";
    let messageCutTemp = [];
    messageCut.forEach(function(part){
      part = part.trim();
      //  console.log(part);
      if (part.startsWith('"')){
        detectLiteral ="debut";
        //  console.log(detectLiteral);
        messageCutTemp.push(part.substr(1));
      }else if (part.endsWith('"')){
        detectLiteral = "fin";
        //console.log(detectLiteral);
        messageCutTemp.push(messageCutTemp.pop()+" "+part.slice(0,-1));
      }else if (detectLiteral == "debut"){
        //  console.log("recupere le dernier et lui ajoute part" )
        messageCutTemp.push(messageCutTemp.pop()+" "+part)
      }else {
        messageCutTemp.push(part);
      }
    });
    if (messageCutTemp.length > 0){
      messageCut = messageCutTemp;
    }

    switch(lastChar){
      case '.':
      inputNew = "";
      break;
      case ';':
      if (messageCut[0].indexOf(" ") > -1){
        inputNew = '"'+messageCut[0]+'"'+' ';
      }else{
        inputNew = messageCut[0]+' ';
      }
      break;
      case ',':
      if (messageCut[0].indexOf(" ") > -1){
        inputNew = '"'+messageCut[0]+'" ';
      }else{
        inputNew = messageCut[0]+' ';
      }
      if (messageCut[1].indexOf(" ") > -1){
        inputNew += '"'+messageCut[1]+'" ';
      }else{
        inputNew += messageCut[1]+' ';
      }
      break;
      case '-':
      if (messageCut[2].indexOf(" ") > -1){
        inputNew = '"'+messageCut[2]+'"'+' ';
      }else{
        inputNew = messageCut[2]+' ';
      }
      break;
      default:
      console.log("message to chat "+message)
      //this.sendMessage(message);
      //  this.agentInput.send('agentSocket', {type: "sendMessage", message:message});
      //  this.catchTriplet(message.slice(0,-1), this.network); // A REMPLACER PAR CATCHTRIPLETS V2
      inputNew = "";
      isTriplet = false;
    }
    if (isTriplet){
      /*  let t = {}
      t.s = messageCut.shift();
      t.p = messageCut.shift();
      t.o = messageCut.join(" ");
      if (this.commandHistory.length > 10){
      this.shift('commandHistory');
    }
    this.push('commandHistory',t);
    let triplets = [];
    triplets.push(t)*/
    // utiliser addActions
    //  this.catchTripletsV2(triplets, this.network);

    //      this.catchTriplet(messageCut, this.network);
    //  this.agentInput.send('agentGraph', {type: "catchTriplet", triplet:messageCut}); //
    console.log(messageCut)
    retour.message = messageCut;
    //        this.agentInput.send('agentSparqlUpdate', {type: "catchTriplet", triplet:messageCut});
  }
}
retour.inputNew = inputNew;

return retour;
}

function  catchCommande(commande){
  console.log(commande)
  switch(commande) {
    case "/h":
    case "/help":
    case "/aide":
    //console.log(this.$.dialogs)
    console.log("help")
    //  this.$.dialogs.$.helpPopUp.toggle();
    //  this.agentInput.send('agentDialogs', {type:'toggle', popup: 'helpPopUp'})
    break;
    case "/e":
    case "/export":
    case "/exportJson":
    //this.exportJson();
    //  this.agentInput.send('agentGraph', {type: 'exportJson'})
    break;
    case "/t":
    //  this.exportTtl(this.network,this);
    //  this.agentInput.send('agentGraph', {type:'exportTtl'}); // , what: 'network', to: 'agentDialogs', where: 'inputTextToSave'
    //    this.agentInput.send('agentDialogs', {type:'toggle', popup: 'popupTtl'})
    break;
    case "/i":
    case "/import":
    case "/importJson":
    //  importJson(network,app);
    //this.$.dialogs.$.importPopUp.toggle();
    //  this.agentInput.send('agentDialogs', {type: 'toggle', popup:'importPopUp'})
    //  this.$.dialogs.$.dialogs.openImport(this.network)
    break;
    case "/n":
    console.log("new graph");
    //  this.newGraph(this.network, this);
    //  this.agentInput.send('agentGraph', {type: 'newGraph'})
    //  this.agentInput.send('agentSparqlUpdate', {type: "newGraph"});
    break;
    case "/b":
    console.log("connection a la base levelgraph");
    //  this.connectBase(this.network,this);
    break;
    /*
    case "/p":
    case "/t":
    // non traité ici , mais par le serveur
    console.log("triplet, predicat ou noeud");
    break;*/
    default:
    console.log("non traite"+ commande);
    //  return afficheCommandes();
  }
}
