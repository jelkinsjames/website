// Gets the latest games of a chess.com user and displays them on the page.
// Author: Julian Elkins James
// Date: 2025-3-1
document.addEventListener("DOMContentLoaded", async function () {
  const username = "jelkinsjames";
  const url = `https://api.chess.com/pub/player/${username}/games/archives`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.archives.length > 0) {
          const latestGamesUrl = data.archives[data.archives.length - 1];
          const gamesResponse = await fetch(latestGamesUrl);
          const gamesData = await gamesResponse.json();

          displayGames(gamesData.games);
      } else {
          document.getElementById("games-container").innerHTML = "<p>No recent games found.</p>";
      }
  } catch (error) {
      document.getElementById("games-container").innerHTML = "<p>Error fetching games.</p>";
  }
});

function displayGames(games) {
  const container = document.getElementById("games-container");
  container.innerHTML = "";
  
  games.slice(0, 5).forEach(game => { // Show only the latest 5 games
      const gameElement = document.createElement("div");
      gameElement.classList.add("game-entry");
      gameElement.innerHTML = `
          <p><strong>Game Date:</strong> ${new Date(game.end_time * 1000).toLocaleDateString()}</p>
          <p><strong>Opponent:</strong> ${game.black.username === "your_username" ? game.white.username : game.black.username}</p>
          <p><a href="${game.url}" target="_blank">View Game</a></p>
          <hr>
      `;
      container.appendChild(gameElement);
  });
}

