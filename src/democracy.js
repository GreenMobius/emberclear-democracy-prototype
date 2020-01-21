let Democracy = {

	/* 
	voteState = {
		chid : <target channel id>,
		action: <add|remove|promote>,
		target : <target user id>,
		yea : [ <uid1>, <uid2> ],
		nay : [ <uid3> ],
		remain : [ <uid4>, <uid5> ],
		time : <timestamp>,
		previous : <link to previous state>,
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
			"error" : null
		}
	},

	// initiate vote for adding a user
	// uid: user id, channel: channel (chid, members)
	addUser: function (sender, target, channel) {
		console.log("Voting to add user " + target + " to channel " + channel.chid + " with members: " + channel.members);
		//TODO: stop if sender is not in channel
		//TODO: stop if target is already in channel
		return this.makeEmptyState(target, channel, "add");
	},

	// initiate vote for removing a user
	// uid: user id, channel: channel (chid, members)
	removeUser: function (sender, target, channel) {
		console.log("Voting to remove user " + target + " from channel " + channel.chid);
		//TODO: stop if sender is not in channel
		//TODO: stop if target is not in channel
		return this.makeEmptyState(target, channel, "remove");
	},

	// initiate vote for promoting a user
	// uid: user id, channel: channel (chid, members)
	promoteUser: function (sender, target, channel) {
		console.log("Voting to promote user " + target + " in channel " + channel.chid);
		//TODO: stop if sender is not in channel
		//TODO: stop if target is already in channel
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
			"error" : null
		}
	},

	// creates a new state with the sender's vote
	// sender: author of vote, prevState: state object, vote: boolean
	vote: function (sender, prevState, vote) {
		console.log("vote is " + vote)
		// TODO: implement hashing previous state
		// TODO: encrypt message with user's private key
		// TODO: add validation logic for previous states
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
		return state;
		}
	}

module.exports = Democracy;
