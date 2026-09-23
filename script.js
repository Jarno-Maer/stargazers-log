const repoList = document.getElementById('repo-list');

async function loadRepositories() {
  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error('Could not load repository data.');
    }

    const repositories = await response.json();

    if (!repositories.length) {
      repoList.innerHTML = '<li class="empty-state">No starred repositories yet.</li>';
      return;
    }

    repoList.innerHTML = repositories
      .map(
        (repo) => `
          <li class="repo-item">
            <div class="repo-header">
              <h2 class="repo-name">
                <a href="https://github.com/${repo.name}" target="_blank" rel="noreferrer">
                  ${repo.name}
                </a>
              </h2>
              <span class="repo-badge">⭐ ${repo.stars.toLocaleString()}</span>
            </div>
            <p class="repo-description">${repo.description}</p>
            <div class="repo-meta">
              <span>${repo.language}</span>
              <span class="meta-dot">Updated ${new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
          </li>
        `
      )
      .join('');
  } catch (error) {
    repoList.innerHTML = '<li class="empty-state">Unable to display starred repositories right now.</li>';
    console.error(error);
  }
}

loadRepositories();
