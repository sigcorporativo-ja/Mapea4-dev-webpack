import namespace from 'util/decorator';

@namespace("M.impl.control")
export class {{archetype.plugin.name}}Control extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the {{archetype.plugin.name}}Control.
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor() {
    super();
  }
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    //obtengo la interacción por defecto del dblclick para manejarla
    let olMap = map.getMapImpl();
    olMap.getInteractions().forEach(interaction => {
      if (interaction instanceof ol.interaction.DoubleClickZoom) {
        this.dblClickInteraction_ = interaction;
      }
    });

    // super addTo - don't delete
    super.addTo(map, html);
  }

   //** Add your own functions */
   activateClick(map) {
    //desactivo el zoom al dobleclick
    this.dblClickInteraction_.setActive(false);

    //añado un listener al evento dblclick
    let olMap = map.getMapImpl();
    olMap.on('dblclick', function (evt) {
      //disparo un custom event con las coordenadas del dobleclick
      let customEvt = new CustomEvent('mapclicked', {
        detail: evt.coordinate,
        bubbles: true
      });
      map.getContainer().dispatchEvent(customEvt);
    });
  }

  deactivateClick(map) {
    //activo el zoom al dobleclick
    this.dblClickInteraction_.setActive(true);

    //elimino el listener del evento
    map.getMapImpl().removeEventListener('dblclick');
  }
}