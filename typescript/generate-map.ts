/*
    Linker som ikke fungerer:
        https://geodata.npolar.no/arcgis/rest/services/Temadata/G_Geologi_Svalbard_S100_S250_Papir_Hs/MapServer/tile/{z}/{y}/{x}
*/
type Point = [number, number];

interface PolygonProperties {
    name: string,
    markers: string
}
interface TileLayer {
    link: string,
    maxZoom: number,
    attribution: string
}

const TILE_LAYER_SETTINGS_ARRAY: Array<TileLayer> = [
    {
        link: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        maxZoom: 19,
        attribution: "&copy;<a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
    },
    {
        link: "https://geodata.npolar.no/arcgis/rest/services/Basisdata/NP_Basiskart_Svalbard_WMTS_3857/MapServer/tile/{z}/{y}/{x}?blankTile=false",
        maxZoom: 13,
        attribution: "&copy;Norsk Polarinstitutt"
    }
];


interface Start {
    elementId: string,
    posX: number,
    posY: number,
    zoom: number
}
const START_SETTINGS: Start = {
    elementId: "map",
    posX: 78.22322581601281,
    posY: 15.646439405180814,
    zoom: 12
}
const MAP = L
    .map(START_SETTINGS.elementId)
    .setView(
        [
            START_SETTINGS.posX,
            START_SETTINGS.posY
        ],
        START_SETTINGS.zoom
    );

function generateTileLayer(tileLayerSettings: TileLayer) {
    L
        .tileLayer(
            tileLayerSettings.link,
            {
                maxZoom: tileLayerSettings.maxZoom,
                attribution: tileLayerSettings.attribution
            }
        )
        .addTo(MAP);
}

TILE_LAYER_SETTINGS_ARRAY.forEach(generateTileLayer);

function clickedPolygon(properties: PolygonProperties, target: any) {
    MAP.fitBounds(target.getBounds());
    importGeoJsonMarkers(properties.markers);
}

function manipulatePolygons(feature: GeoJSON.Feature<GeoJSON.Geometry, any>, layer: L.Layer) {
    layer.on("click", (event) => {
        clickedPolygon(feature.properties, event.target);
    });
}
function manipulateMarkers(feature: GeoJSON.Feature<GeoJSON.Geometry, any>, layer: L.Layer) {
    layer.on("click", () => {console.log("Marker clicked!")});
}

async function importGeoJson(src: string): Promise<GeoJSON.GeoJsonObject> {
    const response = await fetch(src);
    const json = await response.json() as GeoJSON.GeoJsonObject;

    return json;
}
async function importGeoJsonPolygons(src: string) {
    let json = await importGeoJson(`geojson/${src}`);
    L.geoJSON(json, {
        onEachFeature: manipulatePolygons,
        style: feature => {
            return {
                fillColor: "#808080",
                weight: 2,
                opacity: 1,
                color: 'black',
                //dashArray: '3',
                fillOpacity: 0.7
            }
        }
    }).addTo(MAP);

}
async function importGeoJsonMarkers(src: string) {
    let json = await importGeoJson(`geojson/${src}`);
    L.geoJSON(json, {
        onEachFeature: manipulateMarkers
    }).addTo(MAP);
}

importGeoJsonPolygons("daler.json");