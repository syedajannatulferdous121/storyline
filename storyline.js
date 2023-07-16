// StoryLine class
class StoryLine {
  constructor() {
    this.stories = [];
    this.currentStory = null;
    this.userProfiles = {};
  }

  addStory(title, content, type) {
    const newStory = {
      title,
      content,
      type,
      scenes: [],
    };
    this.stories.push(newStory);
    console.log(`Story '${title}' has been added.`);
  }

  viewStories() {
    if (this.stories.length > 0) {
      console.log("All Stories:");
      this.stories.forEach((story) => {
        console.log(`Title: ${story.title}`);
        console.log(`Type: ${story.type}`);
        console.log(`Content: ${story.content}`);
        console.log("---------------");
      });
    } else {
      console.log("No stories available.");
    }
  }

  deleteStory(title) {
    const index = this.stories.findIndex((story) => story.title === title);
    if (index !== -1) {
      this.stories.splice(index, 1);
      console.log(`Story '${title}' has been deleted.`);
    } else {
      console.log(`Story '${title}' not found.`);
    }
  }

  startStory(title, userProfileId) {
    const story = this.stories.find((story) => story.title === title);
    if (story) {
      this.currentStory = story;
      console.log(`Starting story '${title}'...`);
      console.log(`Type: ${story.type}`);
      console.log(`Content: ${story.content}`);

      // Track story progress for the user profile
      if (userProfileId && this.userProfiles[userProfileId]) {
        this.userProfiles[userProfileId].currentStory = story;
        this.userProfiles[userProfileId].sceneIndex = 0;
      }
    } else {
      console.log(`Story '${title}' not found.`);
    }
  }

  createProfile(userId) {
    if (!this.userProfiles[userId]) {
      this.userProfiles[userId] = {
        currentStory: null,
        sceneIndex: 0,
        progress: {},
      };
      console.log(`Profile created for User ID '${userId}'.`);
    } else {
      console.log(`Profile already exists for User ID '${userId}'.`);
    }
  }

  saveProgress(userId, sceneId) {
    if (this.userProfiles[userId] && this.userProfiles[userId].currentStory) {
      const storyTitle = this.userProfiles[userId].currentStory.title;
      this.userProfiles[userId].progress[storyTitle] = sceneId;
      console.log(`Progress saved for User ID '${userId}' in story '${storyTitle}'.`);
    } else {
      console.log(`Profile or current story not found for User ID '${userId}'.`);
    }
  }

  loadProgress(userId) {
    if (this.userProfiles[userId] && this.userProfiles[userId].currentStory) {
      const savedSceneId = this.userProfiles[userId].progress[this.userProfiles[userId].currentStory.title];
      console.log(`Loading progress for User ID '${userId}'...`);
      console.log(`Resuming from scene '${savedSceneId}'.`);
    } else {
      console.log(`Profile or current story not found for User ID '${userId}'.`);
    }
  }

  getNextScene(userId) {
    if (this.userProfiles[userId] && this.userProfiles[userId].currentStory) {
      const currentStory = this.userProfiles[userId].currentStory;
      const sceneIndex = this.userProfiles[userId].sceneIndex;

      if (sceneIndex < currentStory.scenes.length - 1) {
        this.userProfiles[userId].sceneIndex += 1;
        const nextScene = currentStory.scenes[sceneIndex + 1];
        console.log(`Next scene: ${nextScene}`);
      } else {
        console.log("You've reached the end of the story.");
      }
    } else {
      console.log(`Profile or current story not found for User ID '${userId}'.`);
    }
  }

  addSceneToCurrentStory(scene) {
    if (this.currentStory) {
      this.currentStory.scenes.push(scene);
      console.log("Scene added to current story.");
    } else {
      console.log("No story is currently selected.");
    }
  }

  deleteSceneFromCurrentStory(sceneIndex) {
    if (this.currentStory) {
      if (sceneIndex >= 0 && sceneIndex < this.currentStory.scenes.length) {
        this.currentStory.scenes.splice(sceneIndex, 1);
        console.log("Scene deleted from current story.");
      } else {
        console.log("Invalid scene index.");
      }
    } else {
      console.log("No story is currently selected.");
    }
  }
}

// Function to handle user input
function handleUserInput(storyline) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Welcome to StoryLine!");

  rl.question("What would you like to do? (add / view / delete / start / save / load / quit): ", (choice) => {
    switch (choice) {
      case "add":
        rl.question("Enter the title of the story: ", (title) => {
          rl.question("Enter the content of the story: ", (content) => {
            rl.question("Enter the type of the story: ", (type) => {
              storyline.addStory(title, content, type);
              handleUserInput(storyline);
            });
          });
        });
        break;

      case "view":
        storyline.viewStories();
        handleUserInput(storyline);
        break;

      case "delete":
        rl.question("Enter the title of the story to delete: ", (title) => {
          storyline.deleteStory(title);
          handleUserInput(storyline);
        });
        break;

      case "start":
        rl.question("Enter the title of the story to start: ", (title) => {
          const userId = "user123"; // Assuming a fixed user ID for demonstration purposes
          storyline.startStory(title, userId);
          handleUserInput(storyline);
        });
        break;

      case "save":
        rl.question("Enter your user ID: ", (userId) => {
          rl.question("Enter the scene ID to save: ", (sceneId) => {
            storyline.saveProgress(userId, sceneId);
            handleUserInput(storyline);
          });
        });
        break;

      case "load":
        rl.question("Enter your user ID: ", (userId) => {
          storyline.loadProgress(userId);
          handleUserInput(storyline);
        });
        break;

      case "quit":
        rl.close();
        console.log("Goodbye!");
        break;

      default:
        console.log("Invalid choice. Please try again.");
        handleUserInput(storyline);
        break;
    }
  });
}

// Usage example
const storyline = new StoryLine();

// Add some initial stories
storyline.addStory("Adventure of the Lost Treasure", "You embark on a journey to find a lost treasure deep in the jungle.", "Adventure");
storyline.addStory("Mystery of the Haunted Manor", "You are a detective investigating the secrets of a haunted manor.", "Mystery");
storyline.addStory("Romance in Paris", "Experience a heartwarming love story set in the romantic city of Paris.", "Romance");

// Start handling user input
handleUserInput(storyline);

