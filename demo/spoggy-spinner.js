import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-spinner/paper-spinner.js';

class SpoggySpinner extends PolymerElement {
  static get template() {
    return html`
      <paper-spinner active></paper-spinner>
    `;
  }
}
customElements.define('spoggy-spinner', SpoggySpinner);
