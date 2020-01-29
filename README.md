# The Emberclear Democracy Prototype Discord Bot
Created to test out democracy rules and determine voting, state maintenance, and channel algorithms for emberclear.io

## Running the bot
From the home directory:
```
node src/server.js
```

## Bot commands
This readme may not always be up to date on available commands. All commands will be interpreted using src/endpoint.js.

For members, mention them using @user (e.g.: @GreenMobius).
For channels, just provide the channel name (no spaces).

Channels and channel administrator memberships are represented using Discord roles. You are able to configure these roles on your server by applying viewership permissions for text or voice channels to the target roles. Currently, channel admins have no additional power.

```
?test
```
Bot will provide its status. 'OK' means functional.

```
?state
```
Display the state of the vote

```
?create-channel
```
Create a channel with you as the only member and as the admin

```
?add-member [member] [channel]
```
Initiate a vote to add the specified member to the specified channel. You cannot record a yes/no vote using this command. (Requires 51% to occur)

```
?remove-member [member] [channel]
```
Initiate a vote to remove the specified member from the specified channel. You cannot record a yes/no vote using this command. (Requires 51% to occur)

```
?change-admin [member] [channel]
```
Initiate a vote to make the specified member admin of the specified channel. You cannot record a yes/no vote using this command. (Requires 51% to occur)

```
?vote [yes/no]
```
Vote yes or no on the issue at hand. Prints a summary of the current vote counts.

```
?change-user-context-add-member [member] [channel]
```
Change your user context to add a user to your version of a channel

```
?change-user-context-remove-member [member] [channel]
```
Change your user context to remove a user from your version of a channel

```
?change-user-context-admin [member] [channel]
```
Change your user context to set a user as the admin of your version of a channel

```
?view-user-context [member] [channel]
```
View a given user's context for a given channel

```
?cancel-vote
```
Cancel the vote currently in progress

```
?reset
```
Resets all data

```
?sync-discord-roles [member] [channel]
```
Syncs the discord roles with a given user's context
