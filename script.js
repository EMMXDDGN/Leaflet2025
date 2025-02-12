// Initialiser la carte
var map = L.map('map', { 
    center: [48.12, -1.65],
    zoom: 12,
    attributionControl: true
});

// Ajouter des fonds de carte
var baselayers = {
    OSM: L.tileLayer('https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png'),
    ESRI: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'),
    CARTO: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png', {
        opacity: 0.7 // Réduit l'opacité à 70%
    }),
    OrthoRM: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', { layers: 'raster:ortho2021' }),
    PlanRM: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', { layers: 'ref_fonds:pvci_simple_gris' })
};

// Fond de carte par défaut 
baselayers.CARTO.addTo(map);

// Ajouter l'échelle cartographique
L.control.scale().addTo(map);

// Ajouter une attribution personnalisée directement via la carte
map.attributionControl.addAttribution('Réalisation : <a href="https://esigat.wordpress.com/" target="_blank">Master SIGAT</a> / Source : OSM et Rennes Métropole');

// Ajouter une MiniMap
var miniMapLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png');
var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true, minimized: false, position: 'bottomright' }).addTo(map);

// Définir une icône personnalisée AVANT d'ajouter les marqueurs
var Gareicone = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_des_trains_grandes_lignes.png',
    iconSize: [30, 30]
});

var Rennes2icone = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/fr/2/23/Logo_univ-rennes2-2016.svg',
    iconSize: [30, 30]
});

// Marqueur Rennes 2 avec popup
var popupRennes2 = '<h1 class="popup-rose">Université Rennes 2</h1> <br> <img src="https://sites-formations.univ-rennes2.fr/cirefe/wp-content/uploads/2017/07/Plan-Campus.jpg" width="300px">';
var Rennes2 = L.marker([48.119, -1.7013], { icon: Rennes2icone }).bindPopup(popupRennes2).addTo(map);

// Marqueur Gare avec popup et effet hover
var Gare = L.marker([48.103, -1.672], { icon: Gareicone })
    .bindPopup('<b class="popup-rose">Gare de Rennes</b>')
    .addTo(map);

// Ajouter un gestionnaire d'événements pour l'effet hover
Gare.on('mouseover', function () {
    this.openPopup();
});
Gare.on('mouseout', function () {
    this.closePopup();
});

// Ajout du cadastre en WMS
var Cadastre = L.tileLayer.wms('http://geobretagne.fr/geoserver/cadastre/wms', {
    layers: 'CP.CadastralParcel',
    format: 'image/png',
    transparent: true,
    opacity: 0.7 // Réduit l'opacité à 70%
});

// Ajout des aménagements vélo en WMS
var AmenagementVelo = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
    layers: 'trp_doux:v_voirie_amenagement_velo',
    format: 'image/png',
    transparent: true
});

// Ajout du trafic routier en temps réel en WMS
var TraficRoutier = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
    layers: 'trp_rout:v_rva_trafic_fcd',
    format: 'image/png',
    transparent: true
});

// Ajout des bâtiments cadastraux en WMS
var BatimentsCadastre = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
    layers: 'ref_cad:batiment',
    format: 'image/png',
    transparent: true
});

// Ajout des Stations de vélos

var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson,{
// Transformer les marqueurs en point
pointToLayer: function (geoJsonPoint, latlng) {
return L.circleMarker(latlng);
},
// Modifier la symbologie des points
style: function (geoJsonFeature) {
return {
fillColor: '#001f3f',
radius: 6,
fillOpacity: 0.7,
stroke: false};
},
}
).addTo(map);
  // Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h1> Station : "+velos.feature.properties.nom+"</h1>"+"<hr><h2>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h2>" ;
});
});

// Ajouter les marqueurs au contrôle des couches
var couches = {
    "Université Rennes 2": Rennes2,
    "Gare de Rennes": Gare,
    "Cadastre": Cadastre,
    "Bâtiments cadastraux": BatimentsCadastre,
    "Aménagements vélo": AmenagementVelo,
    "Trafic routier": TraficRoutier
};

// Ajouter le contrôleur de couches
// Menu 1 
var menu1 = L.control.layers(baselayers, null, { position: 'bottomleft', collapsed: false }).addTo(map);
// Ajouter un titre personnalisé au menu1 (Fond de carte)
menu1.getContainer().insertAdjacentHTML('afterbegin', '<div class="menu-titre">Fond de carte</div>');

// Menu 2
var menu2 = L.control.layers(null, couches, { position: 'topright', collapsed: false }).addTo(map);
// Ajouter un titre personnalisé au menu2 (Données SIG)
menu2.getContainer().insertAdjacentHTML('afterbegin', '<div class="menu-titre">Données SIG</div>');