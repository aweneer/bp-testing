import React from "react";
import Map from "./Map";
import Header from "./Header";
import Footer from "./Footer";
import PlannerContextPID from "../api/PlannerContextPID";
import walker_icon from "../../assets/Walker.png";
import transfer_icon from "../../assets/Transfer.png";
import next_icon from "../../assets/Next.png";
import waiting_icon from "../../assets/Waiting.png";
import car_icon from "../../assets/Car.png";
import bike_icon from "../../assets/Bike.png";

class ResultContext extends React.Component {
  constructor(props) {
    super(props);
    //state
    this.state = {
      ready: false,
      results: [],
      updateResults: false,
      startId: "no_point",
      viaId: "no_point",
      endId: "no_point",
      selectedResult: "",
    };
    //refs
    this.map = React.createRef();
    this.resultRef = React.createRef();
    //bindings
    this.getStart = this.getStart.bind(this);
    this.getVia = this.getVia.bind(this);
    this.getEnd = this.getEnd.bind(this);
    this.getStartStopPointId = this.getStartStopPointId.bind(this);
    this.getViaStopPointId = this.getViaStopPointId.bind(this);
    this.getEndStopPointId = this.getEndStopPointId.bind(this);
    this.getTimeAndDate = this.getTimeAndDate.bind(this);
    this.processOptions = this.processOptions.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.setApi = this.setApi.bind(this);
    this.setReady = this.setReady.bind(this);
    this.setInputValues = this.setInputValues.bind(this);
    this.createResultItem = this.createResultItem.bind(this);
    this.createResultItemMM = this.createResultItemMM.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.drawJourney = this.drawJourney.bind(this);
    this.drawStartPoint = this.drawStartPoint.bind(this);
    this.drawViaPoint = this.drawViaPoint.bind(this);
    this.drawEndPoint = this.drawEndPoint.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.sendRequestPid = this.sendRequestPid.bind(this);
    this.sendRequestMM = this.sendRequestMM.bind(this);
    this.showJourneyDetails = this.showJourneyDetails.bind(this);
  }

  getStart(start) {
    this.props.writeStart(start);
  }

  getVia(via) {
    this.props.writeVia(via);
  }

  getEnd(end) {
    this.props.writeEnd(end);
  }

  getStartStopPointId(place) {
    this.props.writeStartId(place);
  }
  getViaStopPointId(place) {
    this.props.writeViaId(place);
  }
  getEndStopPointId(place) {
    this.props.writeEndId(place);
  }

  getTimeAndDate(timedate) {
    this.props.writeTimeAndDate(timedate);
  }

  getOptions(options) {
    this.props.writeOptions(options);
  }

  setApi(api) {
    this.props.writeApi(api)
  }

  setReady(bool) {
    this.setState({ ready: bool });
  }

  setInputValues() {
    var from = document.getElementById("input_from");
    var via = document.getElementById("input_via");
    var to = document.getElementById("input_to");
    from.value = this.props.planner.start;
    this.props.planner.via === null
      ? (via.value = "")
      : (via.value = this.props.planner.via);
    to.value = this.props.planner.end;
  }

  checkSearch() {
    if (this.props.planner.start.length === 0) {
      return "";
    } else {
      return " >>> ";
    }
  }

  checkViaRoute() {
    if (this.props.planner.via.length >= 1) {
      return " přes ";
    } else {
      return "";
    }
  }

  checkResults() {
    if (this.state.results !== undefined) {
      switch (this.state.results.length) {
        case 0:
          return "";
        case 1:
          return " --- nalezen 1 výsledek";
        case 2:
        case 3:
        case 4:
          return " --- nalezeny " + this.state.results.length + " výsledky";
        default:
          return " --- nalezeno " + this.state.results.length + " výsledků";
      }
    } else {
      return " nebyl nalezen žádný výsledek, zvolte prosím jiné zadání."
    }
  }

  drawStartPoint(place) {
    if (place.length >= 1) {
      let query = place;
      var url = "https://api.navitia.io/v1/coverage/cz/places?q=" + query;
      var headers = new Headers();
      headers.set(
        "Authorization",
        "Basic " + btoa(process.env.REACT_APP_NAVITIA_TOKEN)
      );
      fetch(url, { method: "GET", headers: headers })
        .then(response => response.json())
        .then(json => {
          var query = json;
          if (query.places !== null && query.places !== undefined) {
            console.log(query);
            for (let i = 0; i < query.places.length; i++) {
              console.log("test");
              if (query.places[i].embedded_type === "stop_area") {
                this.map.current.addMarker(
                  query.places[i].stop_area.coord.lon,
                  query.places[i].stop_area.coord.lat,
                  0,
                  place
                );
                this.map.current.clearTransferPopups();
                this.setState({ startId: query.places[i].id });
                break;
              }
            }
          } else {
            console.log("Nothing");
          }
        });
    } else {
      //console.log("Start Point empty - no marker added.");
    }
  }

  drawViaPoint(place, viaOn) {
    if (viaOn) {
      //console.log("Add");
      if (place.length >= 1) {
        let query = place;
        var url = "https://api.navitia.io/v1/coverage/cz/places?q=" + query;
        var headers = new Headers();
        headers.set(
          "Authorization",
          "Basic " + btoa(process.env.REACT_APP_NAVITIA_TOKEN)
        );
        fetch(url, { method: "GET", headers: headers })
          .then(response => response.json())
          .then(json => {
            var query = json;
            if (query.places !== null && query.places !== undefined) {
              console.log(query);
              for (let i = 0; i < query.places.length; i++) {
                console.log("test");
                if (query.places[i].embedded_type === "stop_area") {
                  this.map.current.addMarker(
                    query.places[i].stop_area.coord.lon,
                    query.places[i].stop_area.coord.lat,
                    1,
                    place
                  );
                  this.setState({ viaId: query.places[i].id });
                  break;
                }
              }
            } else {
              console.log("Nothing");
            }
          });
      } else {
        //console.log("Via Point empty - no marker added.");
      }
    } else {
      //console.log("Not Add");
      this.map.current.addMarker("", "", 3);
    }
  }

  drawEndPoint(place) {
    if (place.length >= 1) {
      let query = place;
      var url = "https://api.navitia.io/v1/coverage/cz/places?q=" + query;
      var headers = new Headers();
      headers.set(
        "Authorization",
        "Basic " + btoa(process.env.REACT_APP_NAVITIA_TOKEN)
      );
      fetch(url, { method: "GET", headers: headers })
        .then(response => response.json())
        .then(json => {
          var query = json;
          if (query.places !== null && query.places !== undefined) {
            console.log(query);
            for (let i = 0; i < query.places.length; i++) {
              console.log("test");
              if (query.places[i].embedded_type === "stop_area") {
                this.map.current.addMarker(
                  query.places[i].stop_area.coord.lon,
                  query.places[i].stop_area.coord.lat,
                  2,
                  place
                );
                this.setState({ endId: query.places[i].id });
                break;
              }
            }
          } else {
            console.log("Nothing");
          }
        });
    } else {
      //console.log("End Point empty - no marker added.");
    }
  }


  processOptions(options) {
    console.log("Process:")
    var value = 0;
    var parameters = options;
    var initialVal = 0;
    console.log("travel_type = "+parameters.travel_type);
    switch (parameters.travel_type) {
      case "normal":
        initialVal = 0.8;
        break;
      case "work":
        initialVal = 0.5;
        break;
      case "school":
        initialVal = 0.5;
        break;
      case "doctor":
        initialVal = 0.45;
        break;
      case "freetime":
        initialVal = 0.85;
        break;
      default:
        initialVal = 1;
    }
    console.log(initialVal)
    value = initialVal;
    
    // Alternate the value based on rest of user input

    switch (parameters.special) {
      case "standard":
        value *= 1;
        break;
      case "slow_walker":
          value *= 0.5;
          break;
      case "wheelchair":
        value *= 0.3;
        break;
      case "luggage":
        value *= 0.5;
        break;
      case "cyclist":
        value *= 0.8;
        break;
      default:
        value = 1;
    }

    console.log(value);

    return value;
  }


  fetchData() {
    console.log(this.state.startId);
    var start = this.props.planner.start;
    var end = this.props.planner.end;
    var via = this.props.planner.via;
    var options = this.props.planner.options;
    var api = this.props.planner.api;
    console.log("fetch:");
    console.log(options.directPath)
    console.log(options.travel_type);
    console.log(options.means);
    console.log(options.special);
    console.log(options.weather)
    //options breakdown
    var searchValue = this.processOptions(options);
    console.log(searchValue)

    switch(api) {
      case "pid":
        this.sendRequestPid(start, end, via, options);
        break;
      case "mmplanner":
        this.sendRequestMM(start, end, via, options);
        break;
      default:
        break;
    }
    
  }

  sendRequestPid(start, end, via, options) {
    var url =
      "https://api.navitia.io/v1/coverage/cz/journeys?from=" +
      this.props.planner.startId +
      "&to=" +
      this.props.planner.endId +
      "&datetime=" +
      this.props.planner.timedate +
      "&min_nb_journeys=3";

    if (options.directPath) {
      url += "&max_nb_transfers=0";
    } else {
      url += "&max_nb_transfers=" + 4;
    }

    // Check for means
    if (options.fastestRoute) {
    }
    if (options.lowWalkingRoute) {
      url += "&max_walking_duration_to_pt=360";
    }
    if (options.transferDistance) {
    }

    if (
      options !== undefined &&
      options.travel_type !== undefined &&
      options.means !== undefined &&
      options.special !== undefined &&
      options.weather !== undefined
    ) {
      if (options.travel_type === "walker") {
        console.log("WALKER===");
        if (options.special.baby) {
          url += "&traveler_type=slow_walker";
        } else {
          switch (options.timeToTransfer) {
            case "5":
              url += "&traveler_type=fast_walker";
              break;
            case "15":
              url += "&traveler_type=slow_walker";
              break;
            default:
              break;
          }
        }
      } else if (options.travel_type === "freetime") {
        
        url += "&traveler_type=cyclist";
      } else if (options.travel_type === "normal") {
        console.log("x")
        if (options.means["Car"] === true && (options.means["Bus"] === false || options.means["Tramway"] === false || options.means["Metro"] === false)) {
          console.log("y")
          url += "&traveler_type=motorist";
        }
        
      } 
      if (options.special === "wheelchair") {
        url += "&traveler_type=wheelchair";
      } else if (options.special === "luggage") {
        url += "&traveler_type=luggage";
      }
    }

    if (via.length < 0) {
      // via
    } else {
      console.log(url);
      if (start.length >= 1 && end.length >= 1) {
        //console.log(url);
        //console.log(this.props.planner.timedate);
        //url = "https://api.navitia.io/v1/coverage/cz/journeys?from=stop_area%3AOCZPRA%3ANavitia%3AU130Z1P&to=stop_area%3AOCZPRA%3AU237S1&datetime=20191217T162700&";
        var headers = new Headers();
        headers.set(
          "Authorization",
          "Basic " + btoa(process.env.REACT_APP_NAVITIA_TOKEN)
        );
        fetch(url, { method: "GET", headers: headers })
          .then(response => response.json())
          .then(json => {
            var query = json;
            console.log("Query:")
            console.log(query);
            this.setState({ results: query.journeys }, () => {
              let resdiv = document.getElementById("results");
              let resitem = resdiv.lastElementChild;
              while (resitem) {
                resdiv.removeChild(resitem);
                resitem = resdiv.lastElementChild;
              }
              
              this.renderResults();
              console.log(query.journeys);
            });
          });
      } else {
        console.log("no fetch");
      }
    }
  }

  sendRequestMM() {
    var mmUrl = "http://localhost:8125/api/findRoutes?maxDate=2020-04-28T14:30:00";
    fetch(mmUrl, { method: "GET" })
          .then(response => response.json())
          .then(json => {
            var query = json;
            console.log("Query MM:")
            console.log(query);
            this.setState({ results: query.data.routes }, () => {
              let resdiv = document.getElementById("results");
              let resitem = resdiv.lastElementChild;
              while (resitem) {
                resdiv.removeChild(resitem);
                resitem = resdiv.lastElementChild;
              }
              console.log("mm render now")
              this.renderResults();
              console.log(query.data.routes);
            })
          });
  }

  componentDidMount() {
    //console.log("=======================================");
    this.setInputValues();
    this.drawStartPoint(this.props.planner.start);
    this.drawViaPoint(this.props.planner.via, true);
    this.drawEndPoint(this.props.planner.end);
    this.fetchData();
    //console.log("results:");
    //console.log(this.state.results);
    this.renderResults();
    if (this.state.updateResults) {
      this.updateResults();
    }
  }

  updateResults() {
    this.drawStartPoint(this.props.planner.start);
    this.props.planner.via.length >= 1
      ? this.drawViaPoint(this.props.planner.via, true)
      : this.drawViaPoint(this.props.planner.via, false);
    this.drawEndPoint(this.props.planner.end);
    this.fetchData();
    this.map.current.clearPath();
  }

  drawJourney(e) {
    var result_id = e.target.getAttribute("result_id");
    var sections = this.state.results[result_id].sections;
    var routeCoords = [];
    var colors = [];
    var transferCoords = [];
    if (this.state.selectedResult.style !== undefined) {
      this.state.selectedResult.setAttribute("selectedResult", "false");
    }
    var possibleResults = document.getElementsByClassName("result_item");
    this.setState({ selectedResult: possibleResults[result_id] });
    possibleResults[result_id].setAttribute("selectedResult", "true");
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].geojson !== undefined) {
        routeCoords.push(sections[i].geojson.coordinates);
        if (sections[i].type === "public_transport") {
          let color = "#" + sections[i].display_informations.color;
          colors.push(color);
        } else if (
          sections[i].type === "transfer" ||
          sections[i].type === "street_network" ||
          sections[i].type === "crow_fly"
        ) {
          if (sections[i].type === "transfer") {
            transferCoords.push(
              sections[i].geojson.coordinates[
                sections[i].geojson.coordinates.length - 1
              ]
            );
          }
          colors.push(process.env.REACT_APP_COLOR_WALKING);
        } else if (sections[i].mode === "bike") {
          transferCoords.push(
            sections[i].geojson.coordinates[
              sections[i].geojson.coordinates.length - 1
            ]
          );
          colors.push(process.env.REACT_APP_COLOR_BIKE);
        } else if (sections[i].mode === "car") {
          transferCoords.push(
            sections[i].geojson.coordinates[
              sections[i].geojson.coordinates.length - 1
            ]
          );
          colors.push(process.env.REACT_APP_COLOR_CAR);
        }
      }
    }
    if (transferCoords.length > 0) {
      this.map.current.addTransferPopup(transferCoords);
    } else {
      this.map.current.clearTransferPopups();
    }
    this.map.current.clearPath();
    this.map.current.addPath(routeCoords, routeCoords.length, colors);
  }

  createResultItem(data, id) {
    var resultItem = document.createElement("p");
    resultItem.className = "result_item";
    resultItem.setAttribute("result_id", id);
    resultItem.setAttribute("id", "result_item" + id);
    resultItem.setAttribute("selectedResult", "false");
    var deparr = document.createTextNode(
      "Odjezd: " +
        data.departure_date_time.substr(9, 2) +
        ":" +
        data.departure_date_time.substr(11, 2) +
        " >> Příjezd: " +
        data.arrival_date_time.substr(9, 2) +
        ":" +
        data.arrival_date_time.substr(11, 2)
    );
    resultItem.appendChild(deparr);
    resultItem.appendChild(document.createElement("br"));
    var duration = document.createTextNode(
      "Trvání: " + Math.round(data.duration / 60) + " minut"
    );
    resultItem.appendChild(duration);
    resultItem.appendChild(document.createElement("br"));
    var means = [];
    // Excluded means
    var excludedMeans = []
    for (var mean in this.props.planner.options.means) {
      if (this.props.planner.options.means[mean] === false) {
        excludedMeans.push(mean)
      }
    }
    var exclude = false;
    // Adding actual results
    for (let i = 0; i < data.sections.length; i++) {
      var type = data.sections[i].type;
      if (type === "street_network" || type === "crow_fly") {
        if (data.sections[i].mode === "bike") {
          for (let i = 0; i < excludedMeans.length; i++) {
            if (excludedMeans[i] === "Bike") { exclude = true};
          }
          var bike = document.createElement("img");
          bike.src = bike_icon;
          bike.setAttribute("result_id", id);
          means.push(bike);
        } else if (data.sections[i].mode === "car") {
          for (let i = 0; i < excludedMeans.length; i++) {
            if (excludedMeans[i] === "Bike") { exclude = true};
          }
          var car = document.createElement("img");
          car.src = car_icon;
          car.setAttribute("result_id", id);
          means.push(car);
        } else {
          var walker = document.createElement("img");
          walker.src = walker_icon;
          walker.setAttribute("result_id", id);
          means.push(walker);
        }
        if (i === 0) {
          let next = document.createElement("img");
          next.src = next_icon;
          next.setAttribute("result_id", id);
          means.push(next);
        }
      }
      if (type === "waiting" && data.sections[i - 1].type !== "transfer") {
        var waiting = document.createElement("img");
        waiting.src = waiting_icon;
        waiting.setAttribute("result_id", id);
        means.push(waiting);
      }
      if (type === "public_transport") {
        var vehicle = document.createElement("p");
        vehicle.setAttribute("result_id", id);
        if (data.sections[i].display_informations.commercial_mode === "Metro") {
          vehicle.className = data.sections[i].display_informations.code;
        } else {
          vehicle.className =
            data.sections[i].display_informations.commercial_mode;
        }
        vehicle.innerHTML = data.sections[i].display_informations.code;
        means.push(vehicle);
      }
      if (type === "transfer") {
        var transfer = document.createElement("img");
        transfer.src = transfer_icon;
        transfer.setAttribute("result_id", id);
        means.push(transfer);
        continue;
      }
      if (i !== data.sections.length - 1 && i !== 0) {
        if (
          data.sections[i - 1].type !== "transfer" &&
          data.sections[i + 1].type !== "transfer"
        ) {
          let next = document.createElement("img");
          next.src = next_icon;
          next.setAttribute("result_id", id);
          means.push(next);
        }
      }
    }

    var journey = document.createElement("label");
    journey.setAttribute("result_id", id);
    journey.className = "journeyMeans";
    for (let l = 0; l < means.length; l++) {
      journey.appendChild(means[l]);
    }

    var detailsBtn = document.createElement("a");
    detailsBtn.className = "detailsBtn";
    detailsBtn.setAttribute("result_id", resultItem.getAttribute("result_id"));
    detailsBtn.innerHTML = "Detaily spojení";
    detailsBtn.addEventListener("click", this.showJourneyDetails);
    var details = document.createElement("div");
    details.className = "details";
    details.setAttribute("result_id", resultItem.getAttribute("result_id"));
    details.style.display = "none";
    var guide = "";
    if (data.sections !== undefined) {
      for (let i = 0; i < data.sections.length; i++) {
        var section = data.sections[i];
        if (i < data.sections.length - 1) {
          if (section.type === "crow_fly") {
            guide +=
              "<label>Přesun na zastávku " + section.to.name + "</label></br>";
          } else if (section.type === "public_transport") {
            guide +=
              "<label>Nastupte do " +
              section.display_informations.commercial_mode +
              " linky " +
              section.display_informations.code +
              " a pokračujte na zástávku " +
              section.to.name +
              "</label></br>";
          } else if (section.type === "transfer") {
            guide +=
              "<label>Následuje přestup na zastávce " +
              section.to.name +
              "</label></br>";
          } else if (section.type === "waiting") {
            if (i + 1 !== data.sections.length) {
              guide +=
                "<label>Vyčkejte příjezdu spoje " +
                data.sections[i + 1].display_informations.commercial_mode +
                " linky " +
                data.sections[i + 1].display_informations.code +
                "</label></br>";
            }
          } else if (section.type === "street_network") {
            guide +=
              "<label>Dojeďte na zastávku " + section.to.name + "</label></br>";
          }
        } else {
          guide +=
            "<label>Vystupte na zastávce " + section.to.name + "</label></br>";
        }
      }
    }
    details.innerHTML =
      "<label><b>Pokyny pro navigaci trasou</b></label></br>" + guide;

    resultItem.appendChild(journey);
    resultItem.addEventListener("click", this.drawJourney);
    resultItem.appendChild(detailsBtn);
    resultItem.appendChild(details);
    console.log(resultItem)
    if (!exclude) {
      return resultItem;
    } else { return null; }
  }

  createResultItemMM(data, id) {
    var resultItem = document.createElement("p");
    resultItem.className = "result_item";
    resultItem.setAttribute("result_id", id);
    resultItem.setAttribute("id", "result_item" + id);
    resultItem.setAttribute("selectedResult", "false");
    var deparr = document.createTextNode(
      "Odjezd: " +
        data.fromTime.substr(11, 2) +
        ":" +
        data.fromTime.substr(14, 2) +
        " >> Příjezd: " +
        data.toTime.substr(11, 2) +
        ":" +
        data.toTime.substr(14, 2)
    );
    resultItem.appendChild(deparr);
    resultItem.appendChild(document.createElement("br"));
    var duration = document.createTextNode(
      //vzdálenost dělena průměrnou rychlostí MHD (26km/h) při rychlosti m/min
      "Trvání: " + Math.round(data.totalDistance / 433) + " minut"
    );
    resultItem.appendChild(duration);
    resultItem.appendChild(document.createElement("br"));
    var means = [];
    // Excluded means
    var excludedMeans = []
    for (var mean in this.props.planner.options.means) {
      if (this.props.planner.options.means[mean] === false) {
        excludedMeans.push(mean)
      }
    }
    var exclude = false;
    // Adding actual results
    for (let i = 0; i < data.segments.length; i++) {
      var type = data.segments[i].type;
      if (type === "WALK") {
        if (data.segments[i].mode === "bike") {
          for (let i = 0; i < excludedMeans.length; i++) {
            if (excludedMeans[i] === "Bike") { exclude = true};
          }
          var bike = document.createElement("img");
          bike.src = bike_icon;
          bike.setAttribute("result_id", id);
          means.push(bike);
        } else if (data.segments[i].mode === "car") {
          var car = document.createElement("img");
          car.src = car_icon;
          car.setAttribute("result_id", id);
          means.push(car);
        } else {
          var walker = document.createElement("img");
          walker.src = walker_icon;
          walker.setAttribute("result_id", id);
          means.push(walker);
        }
        if (i === 0) {
          let next = document.createElement("img");
          next.src = next_icon;
          next.setAttribute("result_id", id);
          means.push(next);
        }
      }
      if (type === "WAIT") {
        var waiting = document.createElement("img");
        waiting.src = waiting_icon;
        waiting.setAttribute("result_id", id);
        means.push(waiting);
      }
      if (type === "public_transport") {
        var vehicle = document.createElement("p");
        vehicle.setAttribute("result_id", id);
        if (data.segments[i].display_informations.commercial_mode === "Metro") {
          vehicle.className = data.segments[i].display_informations.code;
        } else {
          vehicle.className =
            data.segments[i].display_informations.commercial_mode;
        }
        vehicle.innerHTML = data.segments[i].display_informations.code;
        means.push(vehicle);
      }
      if (type === "transfer") {
        var transfer = document.createElement("img");
        transfer.src = transfer_icon;
        transfer.setAttribute("result_id", id);
        means.push(transfer);
        continue;
      }
      
    }

    var journey = document.createElement("label");
    journey.setAttribute("result_id", id);
    journey.className = "journeyMeans";
    for (let l = 0; l < means.length; l++) {
      journey.appendChild(means[l]);
    }

    var detailsBtn = document.createElement("a");
    detailsBtn.className = "detailsBtn";
    detailsBtn.setAttribute("result_id", resultItem.getAttribute("result_id"));
    detailsBtn.innerHTML = "Detaily spojení";
    detailsBtn.addEventListener("click", this.showJourneyDetails);
    var details = document.createElement("div");
    details.className = "details";
    details.setAttribute("result_id", resultItem.getAttribute("result_id"));
    details.style.display = "none";
    var guide = "";
    if (data.sections !== undefined) {
      for (let i = 0; i < data.sections.length; i++) {
        var section = data.sections[i];
        if (i < data.sections.length - 1) {
          if (section.type === "crow_fly") {
            guide +=
              "<label>Přesun na zastávku " + section.to.name + "</label></br>";
          } else if (section.type === "public_transport") {
            guide +=
              "<label>Nastupte do " +
              section.display_informations.commercial_mode +
              " linky " +
              section.display_informations.code +
              " a pokračujte na zástávku " +
              section.to.name +
              "</label></br>";
          } else if (section.type === "transfer") {
            guide +=
              "<label>Následuje přestup na zastávce " +
              section.to.name +
              "</label></br>";
          } else if (section.type === "waiting") {
            if (i + 1 !== data.sections.length) {
              guide +=
                "<label>Vyčkejte příjezdu spoje " +
                data.sections[i + 1].display_informations.commercial_mode +
                " linky " +
                data.sections[i + 1].display_informations.code +
                "</label></br>";
            }
          } else if (section.type === "street_network") {
            guide +=
              "<label>Dojeďte na zastávku " + section.to.name + "</label></br>";
          }
        } else {
          guide +=
            "<label>Vystupte na zastávce " + section.to.name + "</label></br>";
        }
      }
    }
    details.innerHTML =
      "<label><b>Pokyny pro navigaci trasou</b></label></br>" + guide;

    resultItem.appendChild(journey);
    resultItem.addEventListener("click", this.drawJourney);
    resultItem.appendChild(detailsBtn);
    resultItem.appendChild(details);
    console.log(resultItem)
    if (!exclude) {
      return resultItem;
    } else { return null; }
  }

  showJourneyDetails(e) {
    var detailId = e.target.getAttribute("result_id");
    var details = document.getElementsByClassName("details");
    for (let i = 0; i < details.length; i++) {
      if (i !== detailId) {
        details[i].style.display = "none";
      }
    }
    if (details[detailId].style.display === "none") {
      details[detailId].style.display = "block";
    } else {
      details[detailId].style.display = "none";
    }
  }

  renderResults() {
    let resdiv = document.getElementById("results");
    console.log("results state:")
    console.log(this.state.results)
    if (this.state.results !== undefined) {
    for (
      let resultNumber = 0;
      resultNumber < this.state.results.length;
      resultNumber++
    ) {
      let label = document.createElement("label");
      label.setAttribute("for", "result_item" + resultNumber);
      var resultItem;
      console.log(this.props.planner.api)
      if (this.props.planner.api === "mmplanner") {
        console.log("mm create");
        resultItem = this.createResultItemMM(
          this.state.results[resultNumber],
          resultNumber
          );
      } else {
        resultItem = this.createResultItem(
        this.state.results[resultNumber],
        resultNumber
        );
      }
      if (resultItem !== null) {label.appendChild(resultItem);}
      resdiv.appendChild(label);
    }
  }
  }


  render() {
    return (
      <React.Fragment>
        <Header></Header>
        <main className="result_page">
          <section className="results">
            <div id="search">
              <PlannerContextPID
                start={this.getStart}
                via={this.getVia}
                end={this.getEnd}
                startId={this.getStartStopPointId}
                viaId={this.getViaStopPointId}
                endId={this.getEndStopPointId}
                timedate={this.getTimeAndDate}
                getOptions={this.getOptions}
                setApi={this.setApi}
                ready={this.setReady}
                update={this.updateResults}
                resultRef={this.resultRef}
              ></PlannerContextPID>
              <p>
                <b>Pro trasu: </b>
                {this.props.planner.start}
                <b>{this.checkSearch()}</b>
                {this.props.planner.end}
                <b>{this.checkViaRoute()}</b>
                {this.props.planner.via}
                {this.checkResults()}
              </p>
            </div>
            <div id="results" ref={this.resultRef}></div>
          </section>
          <Map ref={this.map}></Map>
        </main>
        <Footer></Footer>
      </React.Fragment>
    );
  }
}

export default ResultContext;
