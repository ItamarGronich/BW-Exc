/**
 * Main DevTools module.
 *
 * Holds the dom model, instantiate the DevTools, and connects all the
 * functionality.
 */
const DevTools = function () {

  // {Element} Will hold reference to the element being dragged.
  let dragged;

  const

    /**
     * Model of the current DOM
     *
     * @type {HTMLElement} Model - Node tree of the body and it's children.
     */
    Model         = document.body,

    // The devtools frame all content will be appended to.
    devToolsFrame = document.createElement('div'),

    // Used events.
    mouseover     = 'mouseover',
    mouseout      = 'mouseout',
    dragstart     = 'dragstart',
    drop          = 'drop',
    dragover      = 'dragover',
    dragleave     = 'dragleave',

    /**
     * Renders the html component that represents the view.
     *
     * @param {HTMLElement} model - the root node of the recognized DOM tree.
     */
    view          = (model) => {

      /**
       * Walks the dom and wraps each node with the Element class.
       *
       * Effectively linking the node and it's representation in the DevTools.
       * @param {HTMLElement} element - the current element being wrapped.
       * @param {Element} parent  - the parent Element of that element.
       */
      const buildTree = (element, parent) => {

        // Skip to DevTools frame, script tags and non elements.
        if ( element === devToolsFrame
          || element.nodeType !== Node.ELEMENT_NODE
          || element.tagName.toLowerCase() === 'script' ) {
          return;
        }

        // Wrap element with Element class.
        let el = new Element(element, parent);


        if ( element.hasChildNodes() ) {
          Array.from(element.childNodes).forEach(node => buildTree(node, el));
        }

      };

      buildTree(model, null);

    };

  /**
   * Wrap the html nodes and bind them to their "twin" in the DevTools frame.
   */
  class Element {

    /**
     * Construct the binding class, attach listeners and add styles.
     *
     * @param {HTMLElement}  el     - The actual dom node.
     * @param {Element|null} parent - The parent Element class if exists.
     */
    constructor(el, parent) {

      // Original node.
      this.node = el;

      // Twin node in DevTools.
      this.twin = document.createElement('div');

      // Attach hover events to the twin element.
      [mouseover, mouseout].forEach(eventName =>
        this.twin.addEventListener(eventName, e => this.hover(event))
      );

      // Attach drag and drop events to the twin element.
      [dragstart, drop, dragover, dragleave].forEach(eventName =>
        this.twin.addEventListener(eventName, e => this.drag(event), false)
      );

      this.twin.textContent = el.tagName.toLowerCase();

      // Set styles.
      this.twin.setAttribute('style',
        `min-width: 20px;
         min-height: 20px;
         border: 1px solid black;
         display: inline-block;
         cursor: pointer;
         padding: 1em;
         margin: 2em 1em 0 0;
         vertical-align: top;
         transition: all 150ms ease-in-out;
         transition-delay: 100ms;
         background: ${this.generateColor()}`);

      // Set draggable.
      this.twin.setAttribute('draggable', 'true');

      // Parent is the DevTools frame if no parent supplied.
      if ( !parent ) {
        parent = devToolsFrame;
      }

      // Insert the created twin node to the DevTools frame.
      this.appendEl(parent);

    }

    /**
     * Append the created twin to the specified parent element.
     *
     * @param {Element|HTMLElement} parent - The parent element|class.
     */
    appendEl(parent) {
      if ( parent instanceof Element ) {
        parent.twin.appendChild(this.twin)
      } else {
        parent.appendChild(this.twin);
      }
    }

    /**
     * Hover event handler.
     *
     * @param {MouseEvent} event - Hover event object.
     */
    hover(event) {

      switch ( event.type ) {

        // onmouseover.
        case mouseover:
          this.node.style.background = 'rgba(35,240,60,.25)';

          // highlight only the target (Needed cause of bubbling).
          if ( event.target === this.twin ) {
            event.target.style.background = this.generateColor('60%', '70%');
          }
          break;

        // onmouseout.
        case mouseout:
          this.node.style.background = '';

          // Set styles back on mouse out.
          if ( event.target === this.twin ) {
            event.target.style.background = this.generateColor();
          }
          break;
      }
    }

    /**
     * Drag & drop event handler.
     *
     * @param {Event} event - The DragEvent object.
     */
    drag(event) {
      event.stopPropagation();

      switch ( event.type ) {

        // ondragstart.
        case dragstart:

          // Store the element being dragged.
          dragged = this;
          event.dataTransfer.dropEffect = 'move';
          break;

        // ondragover. Fires when dragging over an element.
        case dragover:

          // Exit if dragging over oneself or any of it's children.
          if ( event.target === dragged.twin || event.path.includes(dragged.twin) ) return;

          // Enable drop target.
          event.preventDefault();

          // Respond to different sections in target element.
          switch ( this.getSection(event.x) ) {
            case 'left':
              event.target.style.border     = '1px solid black';
              event.target.style.borderLeft = '4px solid black';
              break;
            case 'right':
              event.target.style.border      = '1px solid black';
              event.target.style.borderRight = '4px solid black';
              break;
            default:
              event.target.style.border = '1px solid black';
              event.target.style.border = '4px solid black';
              break;
          }


          break;

        // ondragleave. Fires when dragging out of an element.
        case dragleave:
          event.target.style.border = '1px solid black';

          break;

        // ondrop. Handle the dropping of an element.
        case drop:

          // Set styles back.
          event.target.style.border = '1px solid black';

          // Exit if dragging over oneself or any of it's children.
          if ( event.target === dragged.twin || event.path.includes(dragged.twin) ) return;

          // Enable drop target.
          event.preventDefault();

          // Respond to different sections in target element.
          switch ( this.getSection(event.x) ) {
            case 'left':
              event.target.parentElement.insertBefore(dragged.twin, event.target);
              this.node.parentElement.insertBefore(dragged.node, this.node);
              break;
            case 'right':
              event.target.parentElement.insertBefore(dragged.twin, event.target.nextElementSibling);
              this.node.parentElement.insertBefore(dragged.node, this.node.nextElementSibling);
              break;
            default:
              event.target.appendChild(dragged.twin);
              this.node.appendChild(dragged.node);
              break;
          }

          break;
      }

    }

    /**
     * Get the current section the element is being dragged over.
     *
     * Can be right, left and defaults to center.
     * @param {Number} x - the point on the x access the event occurred.
     *
     * @returns {String|Undefined} - The section. 'left', 'right' or undefied.
     */
    getSection(x) {

      const {left, right} = this.twin.getBoundingClientRect();

      // 10% of the width of the element. limited to min 5 and max 50;
      const edgeArea = Math.min(Math.max(event.target.clientWidth * 0.1, 15), 50);

      // Left or right if currently in 10% range of the element width from each
      // border.
      if ( x > left && x < (left + edgeArea) ) {
        return 'left';
      } else if ( x < right && x > (right - edgeArea) ) {
        return 'right';
      }
    };

    /**
     * Generate a color for the twin element in the devtools based on hash of
     * its tag name.
     *
     * @param {String} [saturation] - must be in a human readable percent value.
     * @param {String} [luminosity] - must be in a human readable percent value.
     *
     * @returns {string} a css acceptable hsl color format.
     */
    generateColor(saturation = '60%', luminosity = '60%') {
      let hue = Utils.hashCode(this.node.tagName.toLowerCase());
      return `hsl(${hue}, ${saturation}, ${luminosity})`;
    }
  }

  /**
   * Static helper functions.
   */
  class Utils {

    /**
     * Generates a numerical hash from a string.
     *
     * @param {String} string - a string to turn into a hash.
     *
     * @returns {number} The hash value of the supplied string.
     */
    static hashCode(string) {
      let hash = 0, i, chr;
      if ( string.length === 0 ) return hash;
      for ( i = 0; i < string.length; i++ ) {
        chr  = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
  }

  return {

    // Render an initial state for the frame.
    init() {

      devToolsFrame.setAttribute('style',
        `height: 400px;
         background: grey;
         border-top: 1px solid darkgrey;
         overflow: auto;`);

      // Append the frame.
      document.body.appendChild(devToolsFrame);

      // fire the update with no action.
      view(Model);

      return this;
    }

  }
};


// HTML fully parsed. Dom now safely editable.
document.addEventListener('DOMContentLoaded', () => {

  // Dom loaded fire-up DevTools.
  DevTools()
    .init();

});