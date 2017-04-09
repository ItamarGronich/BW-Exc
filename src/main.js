/**
 * Main DevTools module.
 *
 * Holds the dom model, instantiate the DevTools, and connects all the
 * functionality.
 */
const DevTools = function () {

  class Utils {

    // Generates a numerical hash from a string.
    static hashCode(string) {
      let hash = 0, i, chr;
      if (string.length === 0) return hash;
      for (i = 0; i < string.length; i++) {
        chr   = string.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
  }

  const

    /**
     * Model of the current DOM
     *
     * @type {HTMLElement} Model - Node tree of the body and it's children.
     */
    Model  = document.body,

    devToolsFrame = document.createElement('div'),

    /**
     * Renders the html component that represents the view.
     *
     * @param model
     */
    view   = (model) => {
      class Element {

        /**
         * Construct the element object.
         *
         * @param {HTMLElement} el
         */
        constructor(el, parent) {

          // Original node.
          this.node = el;


          // Twin node in devtools.
          this.twin = document.createElement('div');

          ['mouseover', 'mouseout'].forEach(eventName =>
            this.twin.addEventListener(eventName, e => this.hover(eventName))
          );

          this.twin.textContent = el.tagName.toLowerCase();
          this.twin.setAttribute('style',
            `min-width: 20px;
             min-height: 20px;
             border: 1px solid black;
             display: inline-block;
             padding: 1em;
             margin: 2em 1em 0 0;
             vertical-align: top;
             background: hsl(${Utils.hashCode(this.twin.textContent)},60%, 60%)`);
          if (!parent) {
            parent = devToolsFrame;
          }

          this.appendEl(parent);

        }

        hover(e) {

          switch (e) {
            case 'mouseover':
              this.node.style.background = 'rgba(35,240,60,.25)';
              break;
            case 'mouseout':
              this.node.style.background = '';
              break;
          }
        }

        appendEl(parent) {
          if (parent instanceof  Element) {
            parent.twin.appendChild(this.twin)
          } else {
            parent.appendChild(this.twin);
          }
        }
      }

      const buildTree = (model, parent) => {

        if ( model === devToolsFrame
          || model.nodeType !== Node.ELEMENT_NODE
          || model.tagName.toLowerCase() === 'script') {
          return;
        }

        let el;

        el = new Element(model, parent);


        if (model.hasChildNodes()) {
          Array.from(model.childNodes).forEach( node => buildTree(node, el));
        }

      };

      buildTree(model, null);

    };

  return {

    // Render an initial state.
    init() {

      devToolsFrame.setAttribute('style',
        `height: 400px;
         background: grey;
         border-top: 1px solid darkgrey;
         overflow: auto;`);

      document.body.appendChild(devToolsFrame);
      // fire the update with no action.
      view(Model);

      return this;
    }

  }
};


// HTML fully parsed. Dom now safely editable.
document.addEventListener('DOMContentLoaded', () => {

  DevTools()
    .init();

});

// Fire when window loads. Page fully loaded.
window.onload = () => {

};
