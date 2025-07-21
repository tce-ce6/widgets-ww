# Graphic Inequality

This project is a simple interactive graphical representation of inequalities. It allows the user to graphically solve inequalities by adjusting a point on a number line, with the goal of matching the point with a correct inequality condition. Users have a limited number of attempts to solve the inequality.

## Features

- **Interactive Graph**: A number line where users can drag a point to graphically solve inequalities.
- **Toggle States**: Toggles to show left or right arrows on the number line, helping guide the user to visualize the inequality.
- **Attempts System**: Users have a set number of attempts to solve the inequality.
- **Feedback System**: Real-time feedback is provided based on the user’s actions, indicating whether the answer is correct or incorrect.
- **Solution Display**: Once all attempts are used, the correct answer is displayed.

## How It Works

1. **Generate a New Problem**: When the "New Problem" button is pressed, a new inequality is generated with a random operator and number (e.g., `x > 5` or `x <= -3`).
2. **Graph the Inequality**: Users can interact with the number line to adjust the point (`x`) using the mouse, dragging it along the line.
3. **Toggle States**: Users can toggle whether the left or right arrow should be visible on the number line, indicating the direction that satisfies the inequality.
4. **Check the Answer**: Once the user believes they've solved the inequality, they can press the "Check" button. The button will only become active if the point or the toggle state has been changed from the initial state.
5. **Attempts**: If the answer is incorrect, the user loses an attempt. After all attempts are used, the correct answer is shown.

## Controls

- **Mouse Drag**: Drag the point on the number line to adjust its position.
- **Toggle Left/Right**: The left and right toggles control the visibility of arrows on the number line, indicating the direction(s) that satisfy the inequality.
- **New Problem Button**: Press the "New Problem" button to generate a new inequality.
- **Check Button**: Press the "Check" button to check if the current configuration (point position and toggle states) satisfies the inequality.

## How to Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/tce-ce6/widgets-v2.git
   cd graphic-inequality

2. **Install p5.js**:
     This project uses the p5.js library to render the graphics. You can include it by adding it to the HTML file or installing it via npm.

3. **Run the project**:
     Open the project in a browser by opening the index.html file in your preferred web browser.


## Project Structure

The project consists of the following key files:

- `index.html` : The HTML file that loads the p5.js library and the sketch.
- `sketch.js`: The JavaScript file that contains the p5.js code to implement the graphical and interactive elements.
- `README.md`: This file.

## Dependencies

- `p5.js`: A JavaScript library for creative coding, which is used for drawing and handling user interactions.


### Additional Notes:
- Replace `git clone https://github.com/your-username/tce-ce6/widgets-v2.git` with your actual repository URL.
- The instructions assume the user can open the project either by using a local server or by opening the `index.html` directly in a browser.
- You can customize or add more sections based on your project’s requirements or any additional setup steps.
