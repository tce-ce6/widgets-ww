Let’s move from Firebase Hosting to GitHub Pages for a simpler workflow and to avoid discrepancies in user-based uploads from different branches. We can use a dedicated deploy branch as the main branch, and whenever a user pushes updates to it, GitHub Pages will automatically update with the latest changes.

Also:

Fetch the username directly from Git and use it as the username, instead of the current approach of using only the first two characters.

Use a local JSON file for each widget to track its status.

Remove the Firebase implementation entirely.

v2:
also try to take the status from commit message if possible