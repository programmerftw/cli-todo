#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

interface Todo {
  task: string;
  completed: boolean;
  reminderTimeout?: NodeJS.Timeout; // Store timeout ID for reminders
}

let todos: Todo[] = [];

async function mainMenu(): Promise<void> {
  console.clear();
  console.log(chalk.blue.bold("Welcome to the CLI To-Do List!"));

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View To-Do List",
        "Add a New Task",
        "Mark Task as Completed",
        "Delete a Task",
        "Exit",
      ],
    },
  ]);

  switch (action) {
    case "View To-Do List":
      viewTodos();
      break;
    case "Add a New Task":
      await addTask();
      break;
    case "Mark Task as Completed":
      await markCompleted();
      break;
    case "Delete a Task":
      await deleteTask();
      break;
    case "Exit":
      console.log(chalk.green("Goodbye!"));
      process.exit();
  }
}

function viewTodos(): void {
  console.clear();
  console.log(chalk.yellow.bold("\nYour To-Do List:\n"));

  if (todos.length === 0) {
    console.log(chalk.red("No tasks found!"));
  } else {
    todos.forEach((todo, index) => {
      const status = todo.completed ? chalk.green("[✔]") : chalk.red("[ ]");
      console.log(`${index + 1}. ${status} ${todo.task}`);
    });
  }

  console.log(); // Add a blank line for spacing
  console.log(chalk.blue("Press Enter to return to the main menu."));
  
  // Wait for the user to press Enter before returning
  require("readline")
    .createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    .question("", () => {
      mainMenu();
    });
}

async function addTask(): Promise<void> {
  const { task } = await inquirer.prompt([
    {
      type: "input",
      name: "task",
      message: "Enter the task description:",
    },
  ]);

  if (task.trim()) {
    todos.push({ task, completed: false });
    console.log(chalk.green("Task added successfully!"));
  } else {
    console.log(chalk.red("Task cannot be empty!"));
  }
  mainMenu();
}

async function markCompleted(): Promise<void> {
  if (todos.length === 0) {
    console.log(chalk.red("\nNo tasks available to mark as completed."));
    mainMenu();
    return;
  }

  const { index } = await inquirer.prompt([
    {
      type: "list",
      name: "index",
      message: "Select a task to mark as completed:",
      choices: todos.map((todo, i) => ({
        name: todo.task,
        value: i,
      })),
    },
  ]);

  todos[index].completed = true;
  console.log(chalk.green("Task marked as completed!"));
  mainMenu();
}

async function deleteTask(): Promise<void> {
  if (todos.length === 0) {
    console.log(chalk.red("\nNo tasks available to delete."));
    mainMenu();
    return;
  }

  const { index } = await inquirer.prompt([
    {
      type: "list",
      name: "index",
      message: "Select a task to delete:",
      choices: todos.map((todo, i) => ({
        name: todo.task,
        value: i,
      })),
    },
  ]);

  todos.splice(index, 1);
  console.log(chalk.green("Task deleted successfully!"));
  mainMenu();
}

mainMenu();
