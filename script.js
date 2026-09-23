const list = document.querySelector("#starred");

const fallbackEvents = [
  { name: "octocat/Hello-World", starred: "2024-01-15" },
  { name: "github/docs", starred: "2024-02-02" },
  { name: "octo-org/octo-repo", starred: "2024-03-21" }
];

function renderEvents(events) {
  if (!Array.isArray(events)) {
    throw new TypeError("The event data is not in the expected array format.");
  }

  list.innerHTML = "";

  if (events.length === 0) {
    list.innerHTML = "<li class='empty-state'>No starred repositories yet.</li>";
    return;
  }

  const validEvents = events.filter(
    (event) => typeof event?.name === "string" && event.name.trim()
  );

  if (validEvents.length === 0) {
    list.innerHTML = "<li class='empty-state'>No valid starred repositories found.</li>";
    return;
  }

  validEvents.forEach((event) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const dateText =
      typeof event.starred === "string" && event.starred.trim()
        ? ` — starred ${event.starred}`
        : " — starred date unavailable";

    link.href = `https://github.com/${event.name}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = event.name;

    item.appendChild(link);
    item.appendChild(document.createTextNode(dateText));
    list.appendChild(item);
  });
}

async function loadStarredRepositories() {
  if (!list) {
    console.error("The #starred list element was not found.");
    return;
  }

  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Failed to load events.json: ${response.status}`);
    }

    const events = await response.json();
    renderEvents(events);
  } catch (error) {
    console.warn("Falling back to built-in sample data:", error);

    if (window.location.protocol === "file:") {
      renderEvents(fallbackEvents);
      return;
    }

    console.error("Unable to load starred repositories:", error);
    list.innerHTML = "<li class='empty-state'>Unable to load starred repositories right now.</li>";
  }
}

loadStarredRepositories();