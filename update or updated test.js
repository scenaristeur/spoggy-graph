update(endpoint, dataset, query) {
  super.update(this.endpoint, this.dataset, this.query);
  console.log('update', this.endpoint, this.dataset, this.query);
  /*var dataset =  JSON.stringify(eval("(" + this.data + ")"));
  if (dataset != undefined){
  dataset = JSON.parse(dataset);
  this.network.body.data.nodes.update(dataset.nodes);
  this.network.body.data.edges.update(dataset.edges);
}*/
if (this._ajaxFuseki != undefined && this.endpoint != undefined){
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
console.log(options)
  console.log(this._ajaxFuseki)
  var app = this;
  let request = this._ajaxFuseki.generateRequest();
  console.log(request);
  request.completes.then(function(request) {
    // succesful request, argument is iron-request element
    var rep = request.response;
    console.log(rep);
    app._handleResponseFuseki(rep);
  }, function(rejected) {
    // failed request, argument is an object
    let req = rejected.request;
    let error = rejected.error;
    app._handleErrorResponseFuseki(error)
    console.log("error", error)
  }
)
}
}




_sparqlToVis1(sparqlRes){
  var visRes = {edges:[]};
  console.log("sparqlRes length: ",sparqlRes.length)
  sparqlRes.forEach(function(sr){
    //console.log(sr);

    //test du triplet sur predicate.value
    switch(sr.p.value){
      case "http://www.w3.org/2000/01/rdf-schema#label":
      let id = sr.s.value.replace('http://smag0.blogspot.fr/NS#_', '')
      let node = {id: id, label: sr.o.value, y: 2*Math.random(), type: "node"};
      //  console.log("LABEL");
      //  console.log(node)
      if (!visRes.hasOwnProperty(id)){
        //  console.log("aucun noeud n'existe ->creation")
        visRes[id] = node;

      }else{
        //  console.log("un noeud existe --> maj du label")
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
          //  console.log("NON PRIS EN CHARGE : ")
          //  console.log(sr);
        }
      }
    }
  });
  console.log(visRes)
  return visRes;
}
