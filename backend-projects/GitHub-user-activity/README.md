# GitHub User Activity CLI

Sample solution for the [github-user-activity](https://roadmap.sh/projects/github-user-activity) challenge from [roadmap.sh](https://roadmap.sh/).

This script fetches a GitHub user's recent events and prints them in a human-readable format in the terminal.

## Requirements

- Node.js 18+ (uses native `fetch`)

## Installation

```bash
git clone https://github.com/waleeddahbour/GitHub-user-activity.git
cd GitHub-user-activity
```

## Usage

Run the script with a GitHub username:

```bash
node github-activity.js <username>
```

Example:

```bash
node github-activity.js kamranahmedse
```

## Example Output

```text
Output:
- Pushed 3 commits to kamranahmedse/developer-roadmap
- Opened a new issue in kamranahmedse/developer-roadmap
- Starred kamranahmedse/developer-roadmap
- ...
```

## Notes

- The script uses the GitHub REST Events API: `GET /users/{username}/events`.
- Event output is mapped by event type (for example: `PushEvent`, `IssuesEvent`, `WatchEvent`, `PullRequestEvent`).
- If no activity is found, it prints `No recent activities.`
