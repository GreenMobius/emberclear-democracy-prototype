let Democracy = {

	/* 
	voteState = {
		channel : <target channel id>,
		action: <add|remove|promote>,
		target : <target user id>,
		yea : [ <uid> ],
		nay : [ <uid> ],
		remain : [ <uid> ],
		time : <timestamp>,
		previous : <link to previous state>,
		key: <uid of last voter>,
		error: <error, null if none>
	}
	*/

	// returns an empty vote state
	// uid: user id, channel: channel (chid, members), action: <"add"|"remove"|"promote">
	makeEmptyState: function (target, channel, action) {
		return {
			"channel" : channel,
			"action" : action,
			"target" : target,
			"yea" : [],
			"nay" : [],
			"remain" : channel.members,
			"time" : new Date(),
			"previous" : null,
			"key" : null,
			"error" : null
		}
	},

	// initiate vote for adding a user
	// uid: user id, channel: channel (chid, members)
	addUser: function (sender, target, channel) {
		console.log("Voting to add user " + target + " to channel " + channel.chid + " with members: " + channel.members);
		if(channel.members.includes(target)) {
			return {
				"error" : "User " + target + " is already in channel" + channel.chid
			}
		}
		return this.makeEmptyState(target, channel, "add");
	},

	// initiate vote for removing a user
	// uid: user id, channel: channel (chid, members)
	removeUser: function (sender, target, channel) {
		console.log("Voting to remove user " + target + " from channel " + channel.chid);
		if(!channel.members.includes(target)) {
			return {
				"error" : "User " + target + " is not in channel" + channel.chid
			}
		}
		return this.makeEmptyState(target, channel, "remove");
	},

	// initiate vote for promoting a user
	// uid: user id, channel: channel (chid, members)
	promoteUser: function (sender, target, channel) {
		console.log("Voting to promote user " + target + " in channel " + channel.chid);
		if(!channel.members.includes(target)) {
			return {
				"error" : "User " + target + " is not in channel" + channel.chid
			}
		}
		return this.makeEmptyState(target, channel, "promote");
	},

	// returns a (hopefully deep) clone of the given state
	// state: state object
	copyState: function (state) {
		return {
			"channel" : state.channel,
			"action" : state.action,
			"target" : state.target,
			"yea" : state.yea,
			"nay" : state.nay,
			"remain" : state.remain,
			"time" : new Date(),
			"previous" : state,
			"key" : vote.previous.remain.filter((member) => !vote.remain.includes(member)),
			"error" : null
		}
	},

	// creates a new state with the sender's vote
	// sender: author of vote, prevState: state object, vote: boolean
	vote: function (sender, prevState, vote) {
		console.log("vote is " + vote)
		if(!prevState.remain.includes(sender.id)) {
			return {
				"error": "Vote is invalid. " + sender.id + " is not in the list " + prevState.remain
			}
		}
		var state = this.copyState(prevState)
		state.remain = state.remain.filter(memberId => !(memberId === sender.id))
		if(vote) {
			state.yea.push(sender)
		} else {
			state.nay.push(sender)
		}
		return state
	},

	isVotePassing: function (vote, user, admin) {
		return vote.yea.length > vote.nay.length + vote.remain.length
			|| (vote.yea.length === vote.nay.length + vote.remain.length
				&& vote.yea.includes(admin))
	},

	isVoteFailing: function (vote, user, admin) {
		return vote.nay.length > vote.yea.length + vote.remain.length
			|| (vote.nay.length === vote.yea.length + vote.remain.length
				&& vote.nay.includes(admin))
	},

	// verifies that the chain of voting makes sense
	// return true if it should be accepted as a valid vote
	verifyVoteChain: function (vote, user, members) {
		//starts with empty vote
		if(vote.previous === null) {
			return vote.yea.length === 0 &&
				vote.nay.length === 0 &&
				vote.remain.length === members.length &&
				vote.remain.filter((member) => !members.includes(member)).length === 0
		}
		//members are consistent
		var completeMemberList = vote.yea + vote.nay + vote.remain

		//user's vote changes from previous

		return verifyVoteChain(vote.previous, vote.key)
	}
}

module.exports = Democracy;
