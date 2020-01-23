export default function normalizeMarker(obj) {
    if (obj.latitude !== undefined && obj.longitude !== undefined) {
        obj.latitude /= 1000.0 * 3600.0;
        obj.longitude /= 1000.0 * 3600.0;
    }
    return obj;
}
