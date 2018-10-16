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
