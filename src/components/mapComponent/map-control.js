import 'leaflet/dist/leaflet.css';
import './map.scss';

const L = require ('leaflet');

import {standard_osm} from './layers/control-layers'
import MiniMap from 'leaflet-minimap';
import 'leaflet.locatecontrol';


//home


const urlsafe = ''
const urlyopal='http://34.132.27.64:8080/geoserver/yopal/wms'


export var map = L.map('map', {
    center: [5.3384139, -72.39162777777779],
    // center: [7.905739, -72.511281],
    zoom: 14,
    layers: [standard_osm]
});

//capas yopal
var ryopal = new L.TileLayer.WMS(urlyopal, {
  layers: 'yopal:r_perimetro',
  format: 'image/png',
  transparent: true,
//   crs: L.CRS.EPSG4326
}).addTo(map);
var uyopal = new L.TileLayer.WMS(urlyopal, {
    layers: 'yopal:u_terreno',
    format: 'image/png',
    transparent: true,
  //   crs: L.CRS.EPSG4326
  }).addTo(map);




//  L.control.zoom({position: 'topleft'}).addTo(map);

// scale control
new L.control.scale({imperial: false}).addTo(map)


// minimap.addTo(map)
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data &copy; OpenStreetMap contributors';
var osm2 = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13, attribution: osmAttrib});
var miniMap = new MiniMap(osm2).addTo(map);

// mark point
var gIcon = L.icon({
    // iconUrl: './../../assets/img/location.png',
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
new L.marker([5.34, -72.40], {icon: gIcon}).addTo(map);
// Location Pluging
const locate = new L.control.locate().addTo(map);
// locate.start()
// console.log('correcto');
// document.addEventListener('click', traerDatos)

// function traerDatos(){}

var ypalUrl = 'http://34.132.27.64:8080/geoserver/yopal/wfs?';
var defaultParameters = {
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    typeName: 'yopal:u_terreno',
    outputFormat: 'application/json',
};
var parameters = L.Util.extend(defaultParameters);
 
var URL = ypalUrl + L.Util.getParamString(parameters);

$.ajax({
	url: URL,
	success: function (data) {
		var geoJsonLayer = L.geoJSON(data,{
		 onEachFeature: function(feature, layer) {
		 layer.bindPopup ("<ul><h6>" +" Datos Solicitados"+" </h6><li>Codigo: " +feature.properties.codigo+" </li><li>Area: " + feature.properties.shape_area +" Ha</li></ul>");
			}
		}).addTo(map);
	}
});

