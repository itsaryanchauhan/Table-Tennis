import streamlit as st
import random

# List of pre-defined players
players = ["John", "Sarah", "Michael", "Emily"]

# Function to generate fixture for singles or doubles
def generate_fixture(players, is_doubles):
    fixture = []
    characters = ["A", "B", "C", "D"]
    teams = []

    # Create teams
    if is_doubles:
        for i in range(0, len(players), 2):
            teams.append([characters[i], characters[i+1], players[i], players[i+1]])
    else:
        for char, player in zip(characters, players):
            teams.append([char, player])

    # Generate fixture
    for i in range(len(teams)):
        for j in range(i+1, len(teams)):
            fixture.append(f"Match {len(fixture)+1} - {teams[i][0]} vs {teams[j][0]}")

    return fixture, teams

# Streamlit app
st.title("Table Tennis Tournament Fixture Generator")

# Get player names
st.subheader("Enter Player Names")
player_names = st.text_input("Player Names (separated by commas)", ",".join(players))
players = [name.strip() for name in player_names.split(",")]

# Get singles or doubles
is_doubles = st.checkbox("Generate Doubles Fixture")

# Generate fixture and teams
fixture, teams = generate_fixture(players, is_doubles)

# Display teams
st.subheader("Teams")
team_table = st.table([team for team in teams])

# Display fixture
st.subheader("Fixture")
fixture_table = st.table([fix for fix in fixture])

# Handle match results
st.subheader("Match Results")
match_results = {}
for match in fixture:
    team1, team2 = match.split(" - ")[1].split(" vs ")
    col1, col2 = st.columns(2)
    with col1:
        if st.button(team1):
            match_results[match] = team1
    with col2:
        if st.button(team2):
            match_results[match] = team2

# Display match results
st.subheader("Match Results")
for match, winner in match_results.items():
    team1, team2 = match.split(" - ")[1].split(" vs ")
    if winner == team1:
        st.markdown(f"**{match}** - **{team1}** ~~{team2}~~")
    else:
        st.markdown(f"**{match}** - ~~{team1}~~ **{team2}**")

# Generate standings
st.subheader("Standings")
team_scores = {team[0]: 0 for team in teams}
for match, winner in match_results.items():
    team1, team2 = match.split(" - ")[1].split(" vs ")
    if winner == team1:
        team_scores[team1] += 1
    else:
        team_scores[team2] += 1

standings = sorted(team_scores.items(), key=lambda x: x[1], reverse=True)
standings_table = st.table(standings)

# Generate playoff fixture
st.subheader("Playoff Fixture")
playoff_fixture = []
top_teams = [team[0] for team in standings[:2]]
bottom_teams = [team[0] for team in standings[2:]]
playoff_fixture.append(f"Match {len(fixture)+1} - {top_teams[0]} vs {top_teams[1]}")
playoff_fixture.append(f"Match {len(fixture)+2} - {bottom_teams[0]} vs {bottom_teams[1]}")
playoff_fixture.append(f"Match {len(fixture)+3} - Loser of Match {len(fixture)+1} vs Winner of Match {len(fixture)+2}")

playoff_table = st.table(playoff_fixture)

# Handle playoff match results
st.subheader("Playoff Match Results")
playoff_results = {}
for match in playoff_fixture:
    team1, team2 = match.split(" - ")[1].split(" vs ")
    col1, col2 = st.columns(2)
    with col1:
        if st.button(team1, key=f"playoff_{team1}"):
            playoff_results[match] = team1
    with col2:
        if st.button(team2, key=f"playoff_{team2}"):
            playoff_results[match] = team2

# Display playoff match results
st.subheader("Playoff Match Results")
for match, winner in playoff_results.items():
    team1, team2 = match.split(" - ")[1].split(" vs ")
    if winner == team1:
        st.markdown(f"**{match}** - **{team1}** ~~{team2}~~")
    else:
        st.markdown(f"**{match}** - ~~{team1}~~ **{team2}**")
