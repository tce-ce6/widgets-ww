
//model
class NumberLineModel {
  constructor(range, snappingRange) {
    this.range = range;
    this.snappingRange = snappingRange;
    this.start = 100;
    this.end = 700 // width - start;
    this.pointY = 200;
    this.pointX = this.mapValueToPixel(0);
    this.pointXAStart = width / 2 + 100;
    this.pointXAEnd = this.end;
    this.pointXA = this.mapPointXToXA(this.pointX);
    this.pointXB = this.mapValueToPixelXB(6);
    this.valueXB = this.mapPixelXBToValue(this.pointXB);
  }

  mapValueToPixel(value) {
    return map(value, -this.range, this.range, this.start, this.end);
  }

  mapPixelToValue(value) {
    return map(value, this.start, this.end, -this.range, this.range);
  }

  mapPointXToXA(pointX) {
    return map(pointX, this.start, this.end, this.pointXAStart, this.pointXAEnd);
  }

  mapXAToPointX(pointXA) {
    return map(pointXA, this.pointXAStart, this.pointXAEnd, this.start, this.end);
  }

mapValueToPixelXB(value){
  return map(value, -this.range, this.range, this.pointXAStart, this.pointXAEnd);
}

mapPixelXBToValue(pixel){
  return map(pixel, this.pointXAStart, this.pointXAEnd, -this.range, this.range);
}

  updatePointX(newX) {
    this.pointX = newX;
    this.pointXA = this.mapPointXToXA(newX);
  }

  updatePointXA(newXA) {
    this.pointXA = newXA;
    this.pointX = this.mapXAToPointX(newXA);
  }

  updateValueXB(newXB){
    this.valueXB = newXB;
    this.valueXB = round(this.mapPixelXBToValue(newXB));
  }

  snapToNearest() {
    const nearestValue = round(this.mapPixelToValue(this.pointX));
    this.pointX = this.mapValueToPixel(nearestValue);
    return nearestValue;

  }
}