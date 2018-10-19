export function catchTriplet(message, network){
  // A REVOIR ET REMPLACER PAR catchTripletsV2() ??
  //  console.log(message.length);
  //message=message.trim();
  //  var tripletString = message.substring(2).trim().split(" ");
  //  var tripletString = message.trim().split(" ");
  // les noeuds existent-ils ?
  var sujetNode = network.body.data.nodes.get({
    filter: function(node){
      //    console.log(node);
      return (node.label == message[0] );
    }
  });
  if (sujetNode.length == 0){
    network.body.data.nodes.add({label: message[0], type: "node", x:2*Math.random(), y:2*Math.random() });
  }
  var objetNode = network.body.data.nodes.get({
    filter: function(node){
      //    console.log(node);
      return (node.label == message[2]);
    }
  });
  //  console.log(sujetNode);
  //  console.log(objetNode);
  // sinon, on les créé

  if (objetNode.length == 0){
    network.body.data.nodes.add({ label: message[2], type: "node", x:-2*Math.random(), y:-2*Math.random() });
  }
  // maintenant ils doivent exister, pas très po=ropre comme méthode , à revoir
  sujetNode = network.body.data.nodes.get({
    filter: function(node){
      return (node.label == message[0] );
    }
  });
  objetNode = network.body.data.nodes.get({
    filter: function(node){
      return (node.label == message[2]);
    }
  });
  var actionSujet = {};
  actionSujet.type = "newNode";
  actionSujet.data = sujetNode[0];
  //  actionsToSendTemp.push(actionSujet);
  //    this.addAction(actionSujet);

  var actionObjet = {};
  actionObjet.type = "newNode";
  actionObjet.data = objetNode[0];
  //  actionsToSendTemp.push(actionObjet);
  //  this.addAction(actionObjet);


  // maintenant, on peut ajouter l'edge
  network.body.data.edges.add({
    label: message[1],
    from : sujetNode[0].id,
    to : objetNode[0].id,
    type: "edge",
  });

  //on récupère ce edge pour l'envoyer au serveur
  var edge = network.body.data.edges.get({
    filter: function(edge) {
      return (edge.from == sujetNode[0].id && edge.to == objetNode[0].id && edge.label == message[1]);
    }
  });
  var actionEdge = {};
  actionEdge.type = "newEdge";
  actionEdge.data = edge;
  //  this.addAction(actionEdge);
  let actionstosend = [];
  actionstosend.push(actionSujet);
  actionstosend.push(actionObjet);
  actionstosend.push(actionEdge);
//  this.agentGraph.send('agentSocket', {type: "newActions", actions: actionstosend});
//  this.agentGraph.send('agentFuseki', {type: "newActions", actions: actionstosend});
  console.log(sujetNode[0])
  //network.redraw();
  network.moveTo({    position: {x:0, y:0}});
/*  network.moveTo({
position: {x:sujetNode[0].x, y:sujetNode[0].y},
scale: 1,
offset: {x:20, y:20},
animation: {
duration: 3,
easingFunction: 'easeInOutCubic'
}
});*/

  //  actionsToSendTemp.push(actionEdge);
  //console.log(actionsToSendTemp);
  //  return actionsToSendTemp;
  return actionstosend;
}
