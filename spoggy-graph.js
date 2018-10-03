import {LitElement, html} from '@polymer/lit-element';

class SpoggyGraph extends LitElement {

  static get properties() {
    return {
      mood: {type: String}
    };
  }

  constructor() {
    super();
    this.mood = 'happy';
  }

  render() {
    return html`<style> .mood { color: green; } </style>
      Spoggy Graph is  <span class="mood">${this.mood}</span>!`;
  }

}

customElements.define('spoggy-graph', SpoggyGraph);
