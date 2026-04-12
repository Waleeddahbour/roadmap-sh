import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

async function choseDificulty() {
  const message = "Please select difficulty level.\
  \n1. Easy (10 chances)\
  \n2. Medium (5 chances)\
  \n3. Hard (3 chances)\n";
  console.log(message);
  
  while (true) {
    const userChoice = (await ask('Please enter your choice: ')).trim().toLowerCase();
    
    if (userChoice === '1' || userChoice ==='easy') return 'easy';
    if (userChoice === '2' || userChoice === 'medium') return 'medium';
    if (userChoice === '3' || userChoice === 'hard') return 'hard';

    console.log('Please type 1, 2, 3, or corresponding difficulty.\n')
  }
}

async function setGame(chances) {
  let attempts = 0;
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  while (attempts < chances) {
    const userGuess = Number((await ask('Enter your guess: ')).trim());

    if (!Number.isInteger(userGuess) || userGuess < 1 || userGuess > 100) {
      console.log('Please enter a valid whole number between 1 and 100.\n');
      continue;
    }

    attempts++;

    if (userGuess < randomNumber) {
      console.log(`Incorrect! The number is greater than ${userGuess}.\
        \nChances left: ${chances-attempts}\n`);
      continue;
    }

    if (userGuess > randomNumber) {
      console.log(`Incorrect! The number is less than ${userGuess}.\
        \nChances left: ${chances-attempts}\n`);
      continue;
    }

    console.log(`Congratulations! You guessed the correct number in ${attempts} attempts.\n`);
    return;
  }

  console.log(`Game over! You've used all ${chances} chances. The number was ${randomNumber}.`);
}

async function main() {
  console.log("Welcome to the Number Guessing Game!\
  \nI'm thinking of a number between 1 and 100.\
  \nYou have limited chances to guess the correct number.\n\n");

  const difficulty = await choseDificulty();
  const chances = difficulty === 'easy' ? 10
  : difficulty === 'medium' ? 5
  : 3;
  
  console.log(`\nGreat! You have selected the ${difficulty} difficulty level. You have ${chances}.\nLet's start the game!\n\n`)

  await setGame(chances);
  rl.close();
}

main().catch((error) => {
  console.error(error);
  rl.close();
  process.exit(1);
});