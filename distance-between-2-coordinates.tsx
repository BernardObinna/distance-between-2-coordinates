const DEGREES_IN_RADIAN = 57.29577951;
const MEAN_EARTH_RADIUS_KM = 6371;
const KILOMETRES_IN_MILE = 1.60934;

type greatCircleObj = {
  location1: string;
  location2: string;
  latitude1_degrees: number;
  longitude1_degrees: number;
  latitude2_degrees: number;
  longitude2_degrees: number;
  latitude1_radians: number;
  longitude1_radians: number;
  latitude2_radians: number;
  longitude2_radians: number;
  central_angle_radians: number;
  central_angle_degrees: number;
  distance_kilometres: number;
  distance_miles: number;
  valid: boolean;
};

function validateDegrees(gc) {
  gc.valid = true;

  if (gc.latitude1_degrees < -90.0 || gc.latitude1_degrees > 90.0) {
    gc.valid = false;
  }

  if (gc.longitude1_degrees < -180.0 || gc.longitude1_degrees > 180.0) {
    gc.valid = false;
  }

  if (gc.latitude2_degrees < -90.0 || gc.latitude2_degrees > 90.0) {
    gc.valid = false;
  }

  if (gc.longitude2_degrees < -180.0 || gc.longitude2_degrees > 180.0) {
    gc.valid = false;
  }
}

function calculateRadians(gc) {
  gc.latitude1_radians = gc.latitude1_degrees / DEGREES_IN_RADIAN;
  gc.longitude1_radians = gc.longitude1_degrees / DEGREES_IN_RADIAN;

  gc.latitude2_radians = gc.latitude2_degrees / DEGREES_IN_RADIAN;
  gc.longitude2_radians = gc.longitude2_degrees / DEGREES_IN_RADIAN;
}

function calculateCentralAngle(gc) {
  let longitudes_abs_diff;

  if (gc.longitude1_radians > gc.longitude2_radians) {
    longitudes_abs_diff = gc.longitude1_radians - gc.longitude2_radians;
  } else {
    longitudes_abs_diff = gc.longitude2_radians - gc.longitude1_radians;
  }

  gc.central_angle_radians = Math.acos(
    Math.sin(gc.latitude1_radians) * Math.sin(gc.latitude2_radians) +
      Math.cos(gc.latitude1_radians) *
        Math.cos(gc.latitude2_radians) *
        Math.cos(longitudes_abs_diff)
  );

  gc.central_angle_degrees = gc.central_angle_radians * DEGREES_IN_RADIAN;
}

function calculateDistance(gc) {
  gc.distance_kilometres = MEAN_EARTH_RADIUS_KM * gc.central_angle_radians;

  gc.distance_miles = gc.distance_kilometres / KILOMETRES_IN_MILE;
}

export const calcDistanceBtwCoordinates = (
  location1,
  latitude1_degrees,
  longitude1_degrees,
  location2,
  latitude2_degrees,
  longitude2_degrees
) => {
  const gc: greatCircleObj = {
    location1,
    location2,
    latitude1_degrees,
    longitude1_degrees,
    latitude2_degrees,
    longitude2_degrees,
    latitude1_radians: 0,
    longitude1_radians: 0,
    latitude2_radians: 0,
    longitude2_radians: 0,
    central_angle_radians: 0,
    central_angle_degrees: 0,
    distance_kilometres: 0,
    distance_miles: 0,
    valid: true,
  };

  if (
    !location1 ||
    !location2 ||
    typeof latitude1_degrees != "number" ||
    typeof longitude1_degrees != "number" ||
    typeof latitude2_degrees != "number" ||
    typeof longitude2_degrees != "number"
  )
    return null;
  validateDegrees(gc);

  if (gc.valid) {
    calculateRadians(gc);
    calculateCentralAngle(gc);
    calculateDistance(gc);
  }

  return gc;
};
