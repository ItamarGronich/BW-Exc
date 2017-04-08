/**
 * Main DevTools module.
 *
 * Holds the dom model, instantiate the DevTools, and connects all the
 * functionality.
 */
const DevTools = function () {

  // Incremental id store.
  let idBank = 0;

  /**
   * DevTools Html element wrapper.
   */
  class Element {

    constructor(elem) {
      this.DomNode = elem;
      this.id = idBank++
    }


  }

  /** The DOM model type. Holds the structure of the Dom and will be used to
   *  generate the DevTools dom representation.
   *
   *  @method addElement
   *  @method remove
   */
  class DomModel {


    constructor() {
      // Holds the acutal dom nodes in tree structure.
      this.tree = new Map();


    }

    /**
     * Set a new element with a new id to the model.
     *
     * @param {Element} el the dom node wrapped in a Element type.
     */
    addElement(el) {
      this.tree.set(el.id,  el);
    }

    removeElement() {

    }

    getModel() {
      return this.tree.entries();
    }
  }


  const model = new DomModel();

  function update(action, model) {

  }


  function view(model) {

  }


  function init() {

    function buildModel(el) {
      if (el.nodeType === Node.ELEMENT_NODE) {
        // Add the element to the model and wrap it with the Element type.
        model.addElement(new Element(el));
      }

      if (el.hasChildNodes()) {

        for (let i = 0; i < el.childNodes.length; i++) {
          const node = new Element(el.childNodes[i]);
          
        }
      }
    }

    let tree = document.body;

    buildModel(tree);
  }

  return {
    DomModel: DomModelFactory(),
    init: init

  }
};


// HTML fully parsed. Dom now safely editable.
document.addEventListener('DOMContentLoaded', () => {

  DevTools().init();

});

// Fire when window loads. Page fully loaded.
window.onload = () => {

};
