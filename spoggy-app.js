import { LitElement, html } from '@polymer/lit-element';
import  'evejs/dist/eve.min.js';
import { AppAgent } from './agents/AppAgent.js'

class SpoggyApp extends LitElement {
  render() {
    const { _endpoint, _dataset, _query, _graph, _source, _mode, disabled } = this;
    return html`
    APP
    `;
  }


    static get properties() {
      return {
        source: {type: String}
      };
    }

    constructor() {
      super();
      this.source = "blop";

    }


    firstUpdated() {
    //  console.log("vis",vis);
      //  console.log("eve",eve);
        this.agentApp = new AppAgent('agentApp', this);
        console.log(this.agentApp);
      //  this.agentApp.send('agentApp', {type: 'dispo', name: 'agentGraph' });

      }

}

window.customElements.define('spoggy-app', SpoggyApp);
