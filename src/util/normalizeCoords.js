export default function normalizeCoords(obj) {
    if (obj.lat !== undefined && obj.lon !== undefined) {
        obj.lat /= 1000.0 * 3600.0;
        obj.lon /= 1000.0 * 3600.0;
    }
    return obj;
}