/**
 * Main DevTools module.
 *
 * Holds the dom model, instantiate the DevTools, and connects all the
 * functionality.
 */
const DevTools = function () {

  /** The DOM model module. Holds the structure of the Dom and will be used to
   *  generate the DevTools dom representation.
   *
   *  @method addElement
   *  @method remove
   */
  const DomModelFactory = function () {

    // The DOM model map. Will hold the structure of the DOM.
    let DomModel = new Map();

    /*  ===  Private Methods ===  */
    function updateModle() {

    }

    /*  ===  Public Methods ===  */
    return {
      addElement() {

      },

      removeElement() {

      },

      getModel() {

      }gca 
    }

  };

  return {
    DomModel: DomModelFactory()
  }
};

/**
 * DevTools Html element wrapper.
 */
class Element {

  constructor(elem) {
    this.DomNode = elem;
  }


}

// HTML fully parsed. Dom now safely editable.
document.addEventListener('DOMContentLoaded', () => {

  DevTools();

});

// Fire when window loads. Page fully loaded.
window.onload = () => {

};
