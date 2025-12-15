// Wait until the HTML document is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

  // Select all habit containers on the page
  const habitContainers = document.querySelectorAll(".habit-container");

  // Loop through each habit container
  habitContainers.forEach((container, index) => {

    // Get all checkboxes, progress bar, and streak display inside the container
    const checkboxes = container.querySelectorAll("input[type='checkbox']");
    const progressBar = container.querySelector(".progress");
    const streakDisplay = container.querySelector(".streak");
    const totalDays = checkboxes.length;

    // Calculate the current streak of consecutive checked days (from the last day backwards)
    function calculateStreak() {
      let streak = 0;
      for (let i = totalDays - 1; i >= 0; i--) {
        if (checkboxes[i].checked) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    }

    // Save checkbox states to localStorage so progress persists after refresh
    function save() {
      const states = [...checkboxes].map(cb => cb.checked);
      localStorage.setItem(`habit_${index}`, JSON.stringify(states));
    }

    // Load saved checkbox states from localStorage
    function load() {
      const saved = localStorage.getItem(`habit_${index}`);
      if (saved) {
        const states = JSON.parse(saved);
        states.forEach((v, i) => {
          if (checkboxes[i]) checkboxes[i].checked = v;
        });
      }
    }

    // Update progress bar, completed styles, and streak display
    function update() {
      // Count how many days are checked
      const checkedCount = [...checkboxes].filter(cb => cb.checked).length;

      // Calculate progress percentage
      const percent = totalDays === 0 ? 0 : Math.round((checkedCount / totalDays) * 100);

      // Update progress bar width
      progressBar.style.width = percent + "%";

      // Add or remove "completed" class for each day
      checkboxes.forEach(cb => {
        const dayDiv = cb.closest(".day");
        if (dayDiv) {
          if (cb.checked) dayDiv.classList.add("completed");
          else dayDiv.classList.remove("completed");
        }
      });

      // Update streak text
      const currentStreak = calculateStreak();
      streakDisplay.textContent = `🔥 Streak: ${currentStreak} days (${checkedCount}/${totalDays})`;
    }

    // Load saved data and update UI on page load
    load();
    update();

    // Listen for checkbox changes to update UI and save progress
    checkboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        update();
        save();
      });
    });
  });
});
