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

document.addEventListener("DOMContentLoaded", async function () {
  loadOTBGames();
});

async function loadOTBGames() {
  const pgnFiles = [
        "round1.pgn", 
        "round2.pgn",
        "round3.pgn",
        "round4.pgn"
      ];

  const tableBody = document.getElementById("otb-games-table").querySelector("tbody");
  tableBody.innerHTML = ""; // Clear previous entries

  for (const file of pgnFiles) {
      try {
          const response = await fetch(`../pgns/${file}`);
          const pgn = await response.text();

          const gameData = parsePGN(pgn);
          
          if (gameData) {
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${gameData.date}</td>
                  <td>${gameData.opponent}</td>
                  <td>${gameData.result}</td>
                  <td>${gameData.event}</td>
                  <td><button onclick="loadPGN('${file}')">View Game</button></td>
              `;
              tableBody.appendChild(row);
          }
      } catch (error) {
          console.error(`Error loading PGN: ${file}`, error);
      }
  }
}

function parsePGN(pgn) {
  const dateMatch = pgn.match(/\[Date \"(.+?)\"\]/);
  const eventMatch = pgn.match(/\[Event \"(.+?)\"\]/);
  const whiteMatch = pgn.match(/\[White \"(.+?)\"\]/);
  const blackMatch = pgn.match(/\[Black \"(.+?)\"\]/);
  const resultMatch = pgn.match(/\[Result \"(.+?)\"\]/);

  if (!dateMatch || !eventMatch || !whiteMatch || !blackMatch || !resultMatch) {
      return null;
  }

  return {
      date: dateMatch[1],
      event: eventMatch[1],
      opponent: whiteMatch[1] !== "Julian Elkins James" ? whiteMatch[1] : blackMatch[1],
      result: resultMatch[1]
  };
}

function loadPGN(pgnFile) {
  fetch(`../pgns/${pgnFile}`)
      .then(response => response.text())
      .then(pgn => {
          document.getElementById("pgn-input").value = pgn;
      })
      .catch(error => console.error("Error loading PGN:", error));
}