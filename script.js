// Get references to various elements in the HTML document
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

// Function to remove unwanted characters from input string
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

// Function to check if input string is in invalid format
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// Function to dynamically add entry fields
function addEntry() {
  // Select the input container based on dropdown value
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  // Get the number of existing entries to create unique IDs
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  // Create HTML string for new entry fields
  const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input
      type="number"
      min="0"
      id="${entryDropdown.value}-${entryNumber}-calories"
      placeholder="Calories"
    />`;
  // Insert the HTML string into the target input container
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

// Function to calculate remaining calories
function calculateCalories(e) {
  e.preventDefault(); // Prevent form submission
  isError = false; // Reset error flag

  // Select all input fields for each meal/exercise
  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  // Get calories consumed for each meal/exercise
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  // Handle invalid input
  if (isError) {
    return;
  }

  // Calculate consumed and remaining calories
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

  // Display output
  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
  `;

  // Show output container
  output.classList.remove('hide');
}

// Function to calculate total calories from input list
function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    // Clean input string and check for invalid format
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    // Handle invalid input
    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }

    // Add calories to total
    calories += Number(currVal);
  }
  return calories;
}

// Function to clear form fields and output
function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  // Clear input containers
  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  // Clear budget input and output
  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide'); // Hide output container
}

// Add event listeners
addEntryButton.addEventListener("click", addEntry); // Add new entry
calorieCounter.addEventListener("submit", calculateCalories); // Calculate calories on form submission
clearButton.addEventListener("click", clearForm); // Clear form fields
