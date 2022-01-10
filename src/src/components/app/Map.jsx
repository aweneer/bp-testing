import React from "react";
import mapboxgl from "mapbox-gl";

/**
 * Komponenta Mapy, využívající knihovnu MapboxGL
 */
class Map extends React.Component {
  constructor(props) {
    super(props);
    /**
     * State komponenty
     * mapbox - komponenta si udržuje aktuální mapbox (mapu), se kterou lze interagovat a odkazovat se na ni
     * ...Marker - je marker hlavních pozic trasy na mapě
     * transferPopups - markery zvýrazňující místa přestupu na mapě
     * route - objekty trasy složené z koordinátů GPS
     * routeLayers - každá část trasy má jiné vlastnosti, každá z nich tedy musí být samostatnou vrstvou
     */
    this.state = {
      mapbox: undefined,
      startMarker: undefined,
      viaMarker: undefined,
      endMarker: undefined,
      transferPopups: [],
      route: undefined,
      routeLayers: undefined
    };
    //Bindings
    this.addTransferPopup = this.addTransferPopup.bind(this);
    this.clearTransferPopups = this.clearTransferPopups.bind(this);
    this.clearPath = this.clearPath.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.addPath = this.addPath.bind(this);
  }

  /**
   * Vykreslí přestupový marker na mapě na zadaných souřadnicích GPS
   * @param {*} coords 
   */
  addTransferPopup(coords) {
    var map = this.state.mapbox;
    var popups = [];
    if (this.state.transferPopups.length !== 0) {
      for (let i = 0; i < this.state.transferPopups.length; i++) {
        this.state.transferPopups[i].remove();
      }
    }
    if (coords !== undefined && coords[0][0] !== undefined && coords[0][1] !== undefined) {
      for (let i = 0; i < coords.length; i++) {
        var popup = new mapboxgl.Popup({"className":"transferPopup"}).setLngLat([coords[i][0], coords[i][1]]).setHTML("Přestup").addTo(map);
        popups.push(popup);
      }
    }
    this.setState({transferPopups: popups})
  }

  /**
   * Vyčistí přestupní markery
   */
  clearTransferPopups() {
    if (this.state.transferPopups.length !== 0) {
      for (let i = 0; i < this.state.transferPopups.length; i++) {
        this.state.transferPopups[i].remove();
      }
    }
  }

  /**
   * Přidá hlavní markery trasy na mapu na zadaných pozicích GPS
   * Type určuje zda jde o start, průjezd, cíl
   * Place je název místa/pozice
   */
  addMarker(lon, lat, type, place) {
    // Prvně dojde k vymazání předchozích markerů
    switch (type) {
      case 0:
        if (this.state.startMarker !== undefined) {
          this.state.startMarker.remove();
        }
        break;
      case 1:
        if (this.state.viaMarker !== undefined) {
          this.state.viaMarker.remove();
        }
        break;
      case 2:
        if (this.state.endMarker !== undefined) {
          this.state.endMarker.remove();
        }
        break;
      case 3:
        if (this.state.viaMarker !== undefined) {
          this.state.viaMarker.remove();
        }
        break;
      default:
        break;
    }
    // Pro interakci s mapou se nastaví tento mapbox
    var map = this.state.mapbox;
    // Přidání markeru na zadaná místa, type určuje zda jde o start, průjezd či cíl.
    if (lon !== undefined && lat !== undefined) {
      switch (type) {
        case 0:
          var info = new mapboxgl.Popup({offset:30}).setText("Začátek trasy: "+place);
          var marker = new mapboxgl.Marker({"color":"#ff0000"}).setLngLat([lon, lat]).setPopup(info).addTo(map);
          this.setState({ startMarker: marker });
          break;
        case 1:
          info = new mapboxgl.Popup({offset:30}).setText("Průjezd přes: "+place);
          marker = new mapboxgl.Marker({"color":"#fff400"}).setLngLat([lon, lat]).setPopup(info).addTo(map);
          this.setState({ viaMarker: marker });
          break;
        case 2:
          info = new mapboxgl.Popup({offset:30}).setText("Cíl trasy: "+place);
          marker = new mapboxgl.Marker({"color":"#00abff"}).setLngLat([lon, lat]).setPopup(info).addTo(map);
          this.setState({ endMarker: marker });
          break;
        default:
          break;
      }
    }
    // Obnovení stavu mapy na aktualizovanou verzi
    this.setState({ mapbox: map });
  }

  /**
   * Metoda k vyčištění mapy. Smaže vykreslenou trasu.
   * Postupně odebírá všechny vrstvy.
   */
  clearPath() {
    var map = this.state.mapbox;
    if (this.state.routeLayers !== undefined) {
      for (let i = 0; i < this.state.routeLayers; i++) {
        var layerId = "path_layer_"+i;
        map.removeLayer(layerId);
        map.removeSource(layerId);
      }
      this.setState({mapbox: map, routeLayers: 0});
    }
  }

  /**
   * Metoda pro vykreslení trasy
   * 
   * @param {*} listCoords - seznam koordinátů
   * @param {*} numLayers - počet vrstev, které se mají vykreslit
   * @param {*} colors - požadované barvy každé části trasy
   */
  addPath(listCoords, numLayers, colors) {
    var map = this.state.mapbox;
    map.flyTo({center: [listCoords[0][0][0], listCoords[0][0][1]]});
    this.state.startMarker.togglePopup();
    this.state.endMarker.togglePopup();
    for (let i = 0; i < numLayers; i++) {
      var layerId = "path_layer_"+i;
      map.addLayer({
        id: layerId,
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: listCoords[i]
            }
          }
        },
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": colors[i] !== undefined ? colors[i] : "#888",
          "line-width": 6
        }
      });
    }
    this.setState({ mapbox: map });
    this.setState({ routeLayers: numLayers });
  }

  /**
   * Při vykreslení komponenty se vytvoří nová mapa, která se zapíše do state komponenty Map
   * Mapa je centrována na střed Prahy
   */
  componentDidMount() {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    var map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [14.42076, 50.08804],
      zoom: 12
    });
    map.addControl(new mapboxgl.NavigationControl());
    this.setState({ mapbox: map });
  }

  /**
   * Před odstraněním komponenty z vykreslení na aktuální stránce se smaže aktuální mapbox ze state
   */
  componentWillUnmount() {
    if (this.state.mapbox !== undefined) {
      this.state.mapbox.remove();
    }
  }

  /**
   * Vykreslení mapy návratem prvku div, který mapu obsahuje
   */
  render() {
    return <div id="map" ref={el => (this.mapContainer = el)} />;
  }
}

export default Map;
