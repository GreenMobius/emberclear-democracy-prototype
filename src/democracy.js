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

	// initiate vote for adding a user
	// uid: user id, chid: channel id
    addUser: function (uid, chid) {
        var state = makeEmptyState(uid, chid, "add");
    },
    
    // initiate vote for removing a user
    // uid: user id, chid: channel id
    removeUser: function (uid, chid) {
        var state = makeEmptyState(uid, chid, "remove");
    },
    
    // initiate vote for promoting a user
    // uid: user id, chid: channel id
    promoteUser: function (uid, chid) {
        var state = makeEmptyState(uid, chid, "promote");
    },

	// returns an empty vote state
    // uid: user id, chid: channel id, action: <"add"|"remove"|"promote">
    makeEmptyState: function (uid, chid, action) {
    	return {
    		"chid" : chid,
    		"action" : action,
    		"uid" : uid,
    		"yea" : [],
    		"nay" : [],
    		"remain" : [], // TODO: all users in channel
    		"time" : new Date(),
    		"previous" : null
    	}
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
    		"previous" : state
    	}
    },

    // creates a new state with the uid's vote
    // uid: user id, prevState: state object, vote: boolean
    vote: function (uid, prevState, vote) {
    	// TODO: implement hashing previous state
    	// TODO: encrypt message with user's private key
    	// TODO: add validation logic for previous states
    	if(!prevState.remain.includes(uid)) {
    		return null;
    	}
    	var state = copyState(prevState);
    	state.remain = state.remain.filter(state.remain.indexOf(uid));
    	if(vote) {
			state.yea.push(uid);
    	} else {
    		state.nay.push(uid);
    	}
    	return state;
    }
}

export default Democracy;
