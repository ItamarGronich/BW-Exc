/**
 * Main DevTools module.
 *
 * Holds the dom model, instantiate the DevTools, and connects all the
 * functionality.
 */
const DevTools = function () {


  const

    /**
     * Actions.
     *
     * these are object just so they can be compared in equality operator.
     * @type {{}}
     */
    Hover  = {},
    Move   = {},

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
          this.twin.addEventListener('mouseover', e => this.hover());
          this.twin.textContent = el.tagName;
          this.twin.setAttribute('style', 'min-width: 100px; min-height: 100px;');

          if (!parent) {
            parent = devToolsFrame;
          }

          this.appendEl(parent);

        }

        hover() {
          this.node.style.background = 'rgba(35,240,60,.5)';
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

        if (model.nodeType === Node.ELEMENT_NODE) {
          new Element(model, parent);
        }

        if (model.hasChildNodes()) {
          Array.from(model.childNodes).forEach( node => buildTree(node));
        }

      };

      const tree = buildTree(model, null);

    }/*,

    /!**
     * update the view and the model.
     *
     * @param {Object}      action - One of the actions defined above.
     * @param {HTMLElement} model  - The DOM
     *!/
    update = (action, model) => {

      switch (action) {

        case Hover :
          console.log('Hover!!');

          break;

        case Move :
          console.log('Move!!');
          break;

        default:
          console.log(`initial state: ${model}`);
          break;
      }

      // Trigger the view function with the updated model.
      view(model);

    }*/;

  return {

    attatchListeners() {

      return this;
    },

    // Render an initial state.
    init() {

      devToolsFrame.setAttribute('style', 'height: 400px; background: grey; border-top: 1px solid darkgrey; overflow: auto;');

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
    .attatchListeners()
    .init();

});

// Fire when window loads. Page fully loaded.
window.onload = () => {

};
