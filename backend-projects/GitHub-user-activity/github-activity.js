async function fetchUserActivity(user) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${user}/events`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2026-03-10',
          'User-Agent': 'github-user-activity-script'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      return;
    }

    const events = await response.json();
    // console.log(evnets);
    return events;
  } catch (error) {
    console.log('Something went wrong:', error.message);
  }
}

function displayFetchedEvents(events) {
  if (!events || events.length === 0) {
    console.log("No recent activities.");
    return;
  }

  events.forEach((event) => {
    const repoName = event.repo?.name || 'an unknown repository';

    switch (event.type) {
      case 'PushEvent': {
        // This payload is no longer provided by the api to get reliable counts you need to call on (https://api.github.com/repos/${owner}/${repo}/compare/${before}...${head})
          const commitCount = event.payload.size ?? 
          event.payload.distinct_size ??
          event.payload.commits?.length ?? 0; 
        console.log(`- Pushed ${commitCount} commits to ${repoName}`);
        break;
      }

      case 'IssuesEvent': {
        if (event.payload?.action === 'opened') {
          console.log(`- Opened a new issue in ${repoName}`);
        } else {
          console.log(`- ${event.payload?.action || 'Updated'} an issue in ${repoName}`);
        }
        break;
      }

      case 'WatchEvent': {
        console.log(`- Starred ${repoName}`);
        break;
      }

      case 'PullRequestEvent': {
        if (event.payload?.action === 'opened') {
          console.log(`- Opened a pull request in ${repoName}`);
        } else {
          console.log(`- ${event.payload?.action || 'Updated'} a pull request in ${repoName}`);
        }
        break;
      }

      case 'ForkEvent': {
        console.log(`- Forked ${repoName}`);
        break;
      }

      case 'CreateEvent': {
        const refType = event.payload?.ref_type || 'resource';
        console.log(`- Created a ${refType} in ${repoName}`);
        break;
      }

      case 'DeleteEvent': {
        const refType = event.payload?.ref_type || 'resource';
        console.log(`- Deleted a ${refType} in ${repoName}`);
        break;
      }

      case 'IssueCommentEvent': {
        console.log(`- Commented on an issue in ${repoName}`);
        break;
      }

      default:
        console.log(`- ${event.type} in ${repoName}`);
    }
  });
}



const username = process.argv[2];
if (!username) {
  console.log('Usage: node github-activity.js <username>');
  process.exit(1);
}

const events = await fetchUserActivity(username);
displayFetchedEvents(events);