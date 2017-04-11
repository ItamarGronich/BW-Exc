/**
 * Main DevTools module.
 *
 * Holds the dom model, instantiate the DevTools, and connects all the
 * functionality.
 */
const DevTools = function () {

  // Will hold reference to the element being dragged.
  let dragged;

  const

    /**
     * Model of the current DOM
     *
     * @type {HTMLElement} Model - Node tree of the body and it's children.
     */
    Model         = document.body,

    devToolsFrame = document.createElement('div'),

    mouseover     = 'mouseover',
    mouseout      = 'mouseout',
    dragstart     = 'dragstart',
    drop          = 'drop',
    dragover      = 'dragover',
    dragleave     = 'dragleave',

    /**
     * Renders the html component that represents the view.
     *
     * @param model
     */
    view          = (model) => {

      const buildTree = (model, parent) => {

        if ( model === devToolsFrame
          || model.nodeType !== Node.ELEMENT_NODE
          || model.tagName.toLowerCase() === 'script' ) {
          return;
        }

        let el = new Element(model, parent);


        if ( model.hasChildNodes() ) {
          Array.from(model.childNodes).forEach(node => buildTree(node, el));
        }

      };

      buildTree(model, null);

    };

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

      // Attach hover events to the twin element.
      [mouseover, mouseout].forEach(eventName =>
        this.twin.addEventListener(eventName, e => this.hover(event))
      );

      // Attach darg and drop events to the twin element.
      [dragstart, drop, dragover, dragleave].forEach(eventName =>
        this.twin.addEventListener(eventName, e => this.drag(event), false)
      );

      this.twin.textContent = el.tagName.toLowerCase();
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

      this.twin.setAttribute('draggable', 'true');
      if ( !parent ) {
        parent = devToolsFrame;
      }

      this.appendEl(parent);

    }

    hover(event) {

      switch ( event.type ) {
        case mouseover:
          this.node.style.background = 'rgba(35,240,60,.25)';
          if ( event.target === this.twin ) {
            event.target.style.background = this.generateColor('60%', '70%');
          }

          break;
        case mouseout:
          this.node.style.background = '';
          if ( event.target === this.twin ) {
            event.target.style.background = this.generateColor();
          }
          break;
      }
    }

    drag(event) {
      event.stopPropagation();

      switch ( event.type ) {
        case dragstart:

          // Store the element being dragged.
          dragged = this;
          event.dataTransfer.dropEffect = 'move';

          break;
        case dragover:

          if ( event.target === dragged.twin || event.path.includes(dragged.twin) ) return;

          event.preventDefault();

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
        case dragleave:
          event.target.style.border = '1px solid black';

          break;

        case drop:

          event.target.style.border = '1px solid black';

          if ( event.target === dragged.twin || event.path.includes(dragged.twin) ) return;

          event.preventDefault();

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

    appendEl(parent) {
      if ( parent instanceof Element ) {
        parent.twin.appendChild(this.twin)
      } else {
        parent.appendChild(this.twin);
      }
    }

    getSection(x) {

      const {left, right} = this.twin.getBoundingClientRect();

      // 10% of the width of the element. limited to min 5 and max 50;
      const edgeArea = Math.min(Math.max(event.target.clientWidth * 0.1, 15), 50);

      // Left or right if currently in 10% range of the element width.
      if ( x > left && x < (left + edgeArea) ) {
        return 'left';
      } else if ( x < right && x > (right - edgeArea) ) {
        return 'right';
      }
    };

    generateColor(saturation = '60%', luminosity = '60%') {
      let hue = Utils.hashCode(this.node.tagName.toLowerCase());
      return `hsl(${hue}, ${saturation}, ${luminosity})`;
    }
  }

  class Utils {

    // Generates a numerical hash from a string.
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
