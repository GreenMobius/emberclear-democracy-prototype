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

    addUser: function (uid, chid) {
        var state = makeEmptyState(uid, chid, "add");
    },
    
    removeUser: function (uid, chid) {
        var state = makeEmptyState(uid, chid, "remove");
    },
    
    promoteUser: function (uid, chid) {
        var state = makeEmptyState(uid, chid, "promote");
    },

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

    vote: function (uid, prevState, vote) {
    	// TODO: implement hashing previous state
    	// TODO: encrypt message with user's private key
    	// TODO: add validation logic for previous states
    	if(!prevState.remain.includes(uid)) {
    		return null;
    	}
    	var state = copyState(prevState);
    	state.remain = state.remain.filter(state.remain.indexOf(uid));
    	state.yea.push(uid);
    	return state;
    }
}

export default Democracy;