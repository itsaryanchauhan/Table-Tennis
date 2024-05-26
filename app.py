import streamlit as st
import random

# Define the list of pre-defined players
players = ["John", "Jane", "Bob", "Alice"]

# Function to generate the tournament fixture
def generate_tournament_fixture(players, is_doubles):
    # Assign characters to each player/team
    characters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    player_chars = dict(zip(players, characters[:len(players)]))

    # Create the tournament fixture
    fixture = []
    if is_doubles:
        for i in range(len(players)):
            for j in range(i+1, len(players)):
                team1 = players[i] + " & " + players[j]
                team2 = players[j] + " & " + players[i]
                fixture.append((player_chars[team1], team1, player_chars[team2], team2))
    else:
        for i in range(len(players)):
            for j in range(i+1, len(players)):
                fixture.append((player_chars[players[i]], players[i], player_chars[players[j]], players[j]))

    return fixture, player_chars

# Streamlit app
st.title("Table Tennis Tournament Fixture Generator")

# Get player names
st.subheader("Enter Player Names")
player_input = st.text_input("Enter player names (separated by commas)", ",".join(players))
player_list = [p.strip() for p in player_input.split(",")]

# Generate the tournament fixture
st.subheader("Select Tournament Type")
is_doubles = st.checkbox("Doubles")
fixture, player_chars = generate_tournament_fixture(player_list, is_doubles)

# Display the fixture
st.subheader("Tournament Fixture")
fixture_table = st.empty()
with fixture_table.container():
    st.write("Character | Player(s)")
    for team1, player1, team2, player2 in fixture:
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.write(team1)
        with col2:
            st.write(player1)
        with col3:
            st.write(team2)
        with col4:
            st.write(player2)

# Handle match results
st.subheader("Match Results")
match_results = {}
for team1, player1, team2, player2 in fixture:
    col1, col2 = st.columns(2)
    with col1:
        if st.button(f"{player1} won", key=f"{team1}_{team2}"):
            match_results[(team1, team2)] = team1
    with col2:
        if st.button(f"{player2} won", key=f"{team2}_{team1}"):
            match_results[(team1, team2)] = team2

# Display the tournament standings
st.subheader("Tournament Standings")
standings = {}
for (team1, team2), winner in match_results.items():
    if winner == team1:
        standings[team1] = standings.get(team1, 0) + 1
    else:
        standings[team2] = standings.get(team2, 0) + 1

sorted_standings = sorted(standings.items(), key=lambda x: x[1], reverse=True)
standings_table = st.empty()
with standings_table.container():
    st.write("Team | Wins")
    for team, wins in sorted_standings:
        st.write(f"{team} | {wins}")

# Generate playoff fixture
st.subheader("Playoff Fixture")
playoff_fixture = []
top_teams = sorted(standings.items(), key=lambda x: x[1], reverse=True)[:4]
if len(top_teams) >= 2:
    playoff_fixture.append((top_teams[0][0], top_teams[1][0]))
if len(top_teams) >= 3:
    playoff_fixture.append((top_teams[2][0], top_teams[3][0]))
    playoff_fixture.append((top_teams[2][0], top_teams[0][1][0]))

playoff_table = st.empty()
with playoff_table.container():
    st.write("Team 1 | Team 2")
    for team1, team2 in playoff_fixture:
        col1, col2 = st.columns(2)
        with col1:
            if st.button(f"{team1} won", key=f"playoff_{team1}_{team2}"):
                match_results[(team1, team2)] = team1
        with col2:
            if st.button(f"{team2} won", key=f"playoff_{team2}_{team1}"):
                match_results[(team1, team2)] = team2
