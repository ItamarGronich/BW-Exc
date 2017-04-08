/**
 * Main DevTools module.
 *
 * Holds the dom model, instantiate the DevTools, and connects all the
 * functionality.
 */
const DevTools = function () {


  const

    /**
     * Actions
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

    /**
     * Renders the html component that represents the view.
     * @param model
     */
    view   = (model) => {

    },

    /**
     * update the view and the model.
     *
     * @param {Object}      action - One of the actions defined above.
     * @param {HTMLElement} model  - The DOM
     */
    update = (action, model) => {

      switch (action) {
        case Hover :
          break;

        case Move :
          break;

        default:
          break;
      }

      // Trigger the view function with the updated model.
      view(model);

    };

  return {

    // Render an initial state.
    init() {

      update(null, Model);
    }

  }
};


// HTML fully parsed. Dom now safely editable.
document.addEventListener('DOMContentLoaded', () => {

  DevTools().init();

});

// Fire when window loads. Page fully loaded.
window.onload = () => {

};
