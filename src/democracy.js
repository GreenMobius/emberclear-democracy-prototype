let Democracy = {

	/* 
	voteState = {
		chid : <target channel id>,
		action: <add|remove|promote>,
		uid : <target user id>,
		yea : [ <uid1>, <uid2> ],
		nay : [ <uid3> ],
		remain : [ <uid4>, <uid5> ],
		time : <timestamp>,
		previous : <link to previous state>
	}
	*/

    // returns an empty vote state
    // uid: user id, channel: channel (chid, members), action: <"add"|"remove"|"promote">
    makeEmptyState: function (uid, channel, action) {
        return {
            "action" : action,
            "uid" : uid,
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
    addUser: function (uid, channel) {
        console.log("Voting to add user " + uid + " to channel " + channel.chid + " with members: " + channel.members);
        var state = this.makeEmptyState(uid, channel, "add");
        return this.vote(uid, state, true);
    },
    
    // initiate vote for removing a user
    // uid: user id, channel: channel (chid, members)
    removeUser: function (uid, channel) {
        console.log("Voting to remove user " + uid + " from channel " + channel.chid);
        var state = this.makeEmptyState(uid, channel, "remove");
        return this.vote(uid, state, true);
    },
    
    // initiate vote for promoting a user
    // uid: user id, channel: channel (chid, members)
    promoteUser: function (uid, channel) {
        console.log("Voting to promote user " + uid + " in channel " + channel.chid);
        var state = this.makeEmptyState(uid, channel, "promote");
        return this.vote(uid, state, true);
    },

    // returns a (hopefully deep) clone of the given state
    // state: state object
    copyState: function (state) {
    	return {
    		"chid" : state.chid,
    		"action" : state.action,
    		"uid" : state.uid,
    		"yea" : state.yea,
    		"nay" : state.nay,
    		"remain" : state.remain,
    		"time" : new Date(),
    		"previous" : state,
            "error" : null
    	}
    },

    // creates a new state with the uid's vote
    // uid: user id, prevState: state object, vote: boolean
    vote: function (uid, prevState, vote) {
    	// TODO: implement hashing previous state
    	// TODO: encrypt message with user's private key
    	// TODO: add validation logic for previous states
    	if(!prevState.remain.includes(uid)) {
    		return {
                "error": "Vote is invalid"
            }
    	}
    	var state = this.copyState(prevState);
    	state.remain = state.remain.filter(state.remain.indexOf(uid));
    	if(vote) {
            state.yea.push(uid);
    	} else {
    		state.nay.push(uid);
    	}
    	return state;
    }   
}

module.exports = Democracy;
