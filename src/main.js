import Menu from './menu.js';
import Language from './language.js';
import Youtube from './youtube.js';


// HTML fully parsed. Dom now safely editable.
document.addEventListener('DOMContentLoaded', () => {

  // Enable language support. Translate page.
  new Language().translate();

  // Initiate Menu.
  new Menu();

  // Initiate Youtube handler module.
  new Youtube();

});

// Fire when window loads. Page fully loaded.
window.onload = () => {

};
