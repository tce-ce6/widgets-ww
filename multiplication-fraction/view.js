//fraction-view

class FractionView {

  constructor(model) {
    this.model = model;
    this.w = 200;
    this.h = 200;
    this.xV = 50;
    this.xH = 350;
    this.x = 50;
    this.y = 100;
    this.num1 = 0;
    this.num2 = 0;
    this.result = this.model.calculateResult();
  }

  /**
   * function to display fraction text
   */
  displayFraction(){
    background(255);

    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`${this.model.numerator1}`, 150, 50);
    text(`${this.model.denominator1}`, 150, 75);

    text(`${this.model.numerator2}`, 450, 50);
    text(`${this.model.denominator2}`, 450, 75);



    stroke(0);
    strokeWeight(2);
    line(140, 62, 160, 62);
    line(440, 62, 460, 62);

    noStroke()
    fill(0);
    textSize(20);
    text('X', 300, 60);

    noStroke()
    fill(0);
    textSize(25);
    text('=', 600, 60);
  }


  /**
   * display function for calling draw & result of fraction
   */
  display() {

    //calling vertical-lined rect

    this.drawVerticalFraction(this.xV, this.y, this.w, this.h, this.model.numerator1, this.model.denominator1, color(100, 150, 255));
    this.drawVerticalFraction(this.xV + this.num1, this.y, this.w, this.h, this.model.numerator1, this.model.denominator1, color(100, 150, 255));

    //calling horizontal-lined rect
    // this.x = 350;
    this.drawHorizontalFraction(this.xH, this.y, this.w, this.h, this.model.numerator2, this.model.denominator2, color(244, 100, 150));
    this.drawHorizontalFraction(this.xH + this.num2, this.y, this.w, this.h, this.model.numerator2, this.model.denominator2, color(244, 100, 150));

    //calling result rect
    // this.x = 650;
    this.drawResultFraction(650, this.y, this.w, this.h, this.result.numerator, this.result.denominator, color(150, 100, 255));

  }


  /**
   * Drawing the rect box with vertical line and the partitioned rect based on denominator & numerator
   * @param {*} x 
   * @param {*} y 
   * @param {*} w 
   * @param {*} h 
   * @param {*} numerator 
   * @param {*} denominator 
   * @param {*} c 
   */
  drawVerticalFraction(x, y, w, h, numerator, denominator, c) {

    stroke(0);
    noFill();
    rect(x, y, w, h);
    let sectionWidth = w / denominator;
    for (let i = 0; i < denominator; i++) {
      if (i < numerator) {
        fill(c);
      }
      else {
        noFill();
      }
      rect(x + i * sectionWidth, y, sectionWidth, h);
    }

    noStroke()
    fill(0);
    textSize(32);
    text('X', 300, 200);
  }

  /**
   * Drawing the rect box with horizontal line
   * @param {*} x 
   * @param {*} y 
   * @param {*} w 
   * @param {*} h 
   * @param {*} numerator 
   * @param {*} denominator 
   * @param {*} c 
   */
  drawHorizontalFraction(x, y, w, h, numerator, denominator, c) {
    stroke(0);
    noFill();
    rect(x, y, w, h);
    let sectionHeight = h / denominator;
    for (let i = 0; i < denominator; i++) {
      let offset = y + h - (i + 1) * sectionHeight;
      if (i < numerator) {
        fill(c);
      }
      else {
        noFill();
      }
      rect(x, offset, w, sectionHeight);
    }
    noStroke()
    fill(0);
    textSize(40);
    text('=', 600, 200);
  }

  /**
   * function for drawing result fraction
   * @param {*} x 
   * @param {*} y 
   * @param {*} w 
   * @param {*} h 
   * @param {*} numerator 
   * @param {*} denominator 
   * @param {*} c 
   */
  drawResultFraction(x, y, w, h, numerator, denominator, c) {
    stroke(0);
    noFill();
    rect(x, y, w, h);

    if (this.model.pointX == this.model.end) {
      let sectionWidth = w / this.model.denominator1;
      let sectionHeight = h / this.model.denominator2;
      for (let j = this.model.denominator2 - 1; j >= 0; j--) {
        for (let i = 0; i < this.model.denominator1; i++) {
          let xOffset = x + i * sectionWidth;
          let yOffset = y + (this.model.denominator2 - j - 1) * sectionHeight; // Fill from bottom
          if (i < this.model.numerator1 && j < this.model.numerator2) {
            fill(c);
          } else {
            noFill();
          }
          rect(xOffset, yOffset, sectionWidth, sectionHeight);
        }
      }

      fill(0);
      stroke(0);
      strokeWeight(1);
      textSize(20);
      textAlign(CENTER, CENTER);
      text(`${this.result.numerator}`, 750, 50);
      text(`${this.result.denominator}`, 750, 75);

      stroke(0);
      strokeWeight(2);
      line(740, 62, 760, 62);
    }
  }

//Drawing sliderLine
  // displaySliderLine() {
  //   stroke(10, 10, 255);
  //   strokeWeight(5);
  //   line(this.model.start, this.model.pointY, this.model.end, this.model.pointY, 10);
  // }


  // //Drawing moveable point on sliderline
  // displayPoint() {
  //   fill(10, 10, 255);
  //   stroke(0);
  //   strokeWeight(1);
  //   ellipse(this.model.pointX, this.model.pointY, 20);

  //   fill(100, 149, 237, 1);
  //   ellipse(this.model.pointX, this.model.pointY, 30);
  // }

}
