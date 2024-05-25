let players = [];
let teams = [];
let matches = [];
let playoffs = [];

document.addEventListener('DOMContentLoaded', () => {
    updatePlayerList();
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('header');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

function addPlayer() {
    const playerInput = document.getElementById('playerInput');
    const playerName = playerInput.value.trim();
    if (playerName !== '' && !players.includes(playerName)) {
        players.push(playerName);
        playerInput.value = '';
        updatePlayerList();
    } else {
        alert('Please enter a unique player name or a non-empty value.');
    }
}

function quickAddPlayer(playerName) {
    if (!players.includes(playerName)) {
        players.push(playerName);
        updatePlayerList();
    } else {
        alert('Player already added.');
    }
}

function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach(player => {
        const playerItem = document.createElement('li');
        playerItem.textContent = player;
        playerList.appendChild(playerItem);
    });
}

function generateTeams() {
    if (players.length % 2 !== 0) {
        alert('Number of players must be even to form teams.');
        return;
    }

    teams = [];
    matches = [];

    let teamChar = 'A';
    for (let i = 0; i < players.length; i += 2) {
        teams.push({ teamName: teamChar, members: [players[i], players[i+1]], wins: 0 });
        teamChar = String.fromCharCode(teamChar.charCodeAt(0) + 1);
    }

    generateFixtures();
    displayTeams();
}

function generateFixtures() {
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push({ team1: teams[i].teamName, team2: teams[j].teamName, winner: null });
        }
    }
    displayFixtures();
}

function displayTeams() {
    const teamTable = document.getElementById('teamAssignments');
    teamTable.innerHTML = '<tr><th>Team</th><th>Players</th></tr>';
    teams.forEach(team => {
        const row = `<tr><td>${team.teamName}</td><td>${team.members.join(' & ')}</td></tr>`;
        teamTable.innerHTML += row;
    });
}

function displayFixtures() {
    const fixturesDiv = document.getElementById('fixtures');
    fixturesDiv.innerHTML = '';
    matches.forEach((match, index) => {
        const matchDiv = document.createElement('div');
        matchDiv.innerHTML = `Match ${index + 1}: Team ${match.team1} vs Team ${match.team2} <button onclick="recordWinner('${match.team1}', '${match.team2}', ${index})">Record Winner</button> <span id="winner${index}"></span>`;
        fixturesDiv.appendChild(matchDiv);
    });
}

function recordWinner(team1, team2, matchIndex) {
    const winner = prompt(`Enter winner for Match between Team ${team1} and Team ${team2}: (Enter ${team1} or ${team2})`).toUpperCase();
    if (winner !== team1 && winner !== team2) {
        alert("Invalid team name entered. Please try again.");
        return;
    }
    matches[matchIndex].winner = winner;
    document.getElementById(`winner${matchIndex}`).textContent = ` Winner: Team ${winner}`;
    updateTeamWins(winner);
    checkAllMatchesCompleted();
}

function updateTeamWins(winner) {
    const winningTeam = teams.find(team => team.teamName === winner);
    winningTeam.wins++;
}

function checkAllMatchesCompleted() {
    if (matches.every(match => match.winner !== null)) {
        displayTeamWins();
        generatePlayoffs();
    }
}

function displayTeamWins() {
    const teamWinsDiv = document.getElementById('teamWins');
    teamWinsDiv.innerHTML = '<h2>Team Wins</h2><table><tr><th>Team</th><th>Wins</th></tr>';
    teams.sort((a, b) => b.wins - a.wins); // Sort teams by wins
    teams.forEach(team => {
        teamWinsDiv.innerHTML += `<tr><td>${team.teamName}</td><td>${team.wins}</td></tr>`;
    });
    teamWinsDiv.innerHTML += '</table>';
}

function generatePlayoffs() {
    const topTeams = teams.slice(0, 4); // Get top 4 teams
    playoffs.push({ team1: topTeams[0].teamName, team2: topTeams[1].teamName, matchType: 'semi-final', winner: null });
    playoffs.push({ team1: topTeams[2].teamName, team2: topTeams[3].teamName, matchType: 'semi-final', winner: null });
    displayPlayoffFixtures();
}

function displayPlayoffFixtures() {
    const playoffDiv = document.getElementById('playoffs');
    playoffDiv.innerHTML = '<h2>Playoff Matches</h2>';
    playoffs.forEach((playoff, index) => {
        const playoffMatchDiv = document.createElement('div');
        playoffMatchDiv.innerHTML = `Playoff Match ${index + 1}: Team ${playoff.team1} vs Team ${playoff.team2} <button onclick="recordPlayoffWinner('${playoff.team1}', '${playoff.team2}', ${index})">Record Winner</button> <span id="playoffWinner${index}"></span>`;
        playoffDiv.appendChild(playoffMatchDiv);
    });
}

function recordPlayoffWinner(team1, team2, matchIndex) {
    const winner = prompt(`Enter winner for Playoff Match between Team ${team1} and Team ${team2}: (Enter ${team1} or ${team2})`).toUpperCase();
    if (winner !== team1 && winner !== team2) {
        alert("Invalid team name entered. Please try again.");
        return;
    }
    playoffs[matchIndex].winner = winner;
    document.getElementById(`playoffWinner${matchIndex}`).textContent = ` Winner: Team ${winner}`;
    updatePlayoffMatches(winner, matchIndex);
}

function updatePlayoffMatches(winner, matchIndex) {
    // Check if both semi-finals are complete
    if (playoffs.every(match => match.winner !== null)) {
        // Identify winners from both semi-finals
        const firstWinner = playoffs[0].winner;
        const secondWinner = playoffs[1].winner;
        
        // Schedule final match based on winners
        playoffs.push({
            team1: firstWinner,
            team2: secondWinner,
            matchType: 'final',
            winner: null
        });
        
        displayPlayoffFixtures();
    }
}

function scheduleFinals() {
    // Logic specific to your desired final match format (e.g., best-of-3 series)
    // This example simply displays a message indicating the finalists
    const finalists = playoffs.slice(-1)[0]; // Get the final match object
    const finalMessage = `The Final Match will be between Team ${finalists.team1} and Team ${finalists.team2}`;
    alert(finalMessage);
}

// Assuming previous JavaScript setup, add this function
function setupMatchClicks() {
    const matches = document.querySelectorAll('.match');
    matches.forEach(match => {
        match.addEventListener('click', function() {
            const winner = this.getAttribute('data-team');
            recordWinner(winner, this.getAttribute('data-index'));
        });
    });
}

function displayFixtures() {
    const fixturesDiv = document.getElementById('fixtures');
    fixturesDiv.innerHTML = '';
    matches.forEach((match, index) => {
        const matchDiv = document.createElement('div');
        matchDiv.classList.add('match');
        matchDiv.setAttribute('data-index', index);
        matchDiv.setAttribute('data-team', match.team1);
        matchDiv.innerHTML = `Match ${index + 1}: <button class="team-btn">${match.team1}</button> vs <button class="team-btn">${match.team2}</button>`;
        fixturesDiv.appendChild(matchDiv);
    });
    setupMatchClicks();
}

function recordWinner(team1, team2, matchIndex) {
    const winnerInput = prompt(`Enter winner for Match between Team ${team1} and Team ${team2}: (Enter ${team1} or ${team2})`).toUpperCase();
    if (winnerInput !== team1 && winnerInput !== team2) {
        alert("Invalid team name entered. Please try again.");
        return;
    }

    // Check if the matchIndex is within the bounds of the matches array
    if (matchIndex >= 0 && matchIndex < matches.length) {
        matches[matchIndex].winner = winnerInput;

        const winnerElement = document.getElementById(`winner${matchIndex}`);
        if (winnerElement) {
            winnerElement.textContent = ` Winner: Team ${winnerInput}`;
        } else {
            console.error(`Element with ID 'winner${matchIndex}' not found.`);
        }

        updateTeamWins(winnerInput);
        checkAllMatchesCompleted();
    } else {
        console.error(`No match found at index ${matchIndex}. Please check the index and try again.`);
    }
}
