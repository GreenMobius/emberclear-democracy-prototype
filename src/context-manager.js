let ContextManager = {

	contexts: [],

	add_channel: function(channel_uid, user_uid){
		if(contexts.every((context) => context.channel !== channel_uid)){
			contexts.push({
				"channel": channel_uid,
				"user_contexts": [{
					"user": user_uid,
			        "user_context": {
			        	"admin": user_uid,
			        	"members": [
			            	user_uid
			          	]
			        }
				}]
			})
		}	
	},

	add_user: function(channel_uid, user_uid){
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined && channelContext.user_contexts.every((userContext) => userContext.user !== user_uid)){
			channelContext.user_contexts.forEach((userContext) => {
				if(userContext.user_context.members.find(user_uid) === undefined){
					userContext.user_context.members.push(user_uid)
				}				
			})
			channelContext.user_contexts.push({
				"user": user_uid,
				"user_context": determine_channel_context()
			})
		}
		sync_user_contexts()
	},

	delete_user: function(channel_uid, user_uid){
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var index = channelContext.user_contexts.findIndex((userContext) => userContext.user === user_uid)
			if(index !== -1){
				channelContext.user_contexts.splice(index, 1)
				channelContext.user_contexts.forEach((userContext) => {
					var userMemberIndex = userContext.user_context.members.findIndex((member) => member === user_uid)
					if(userMemberIndex !== -1){
						userContext.user_context.members.splice(userMemberIndex, 1)
					}
				})
			}
		}
		sync_user_contexts()
	},

	change_admin: function(channel_uid, user_uid){
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined && determine_if_user_is_in_channel(channel_uid, user_uid)){
			channelContext.user_contexts.forEach((userContext) => userContext.user_context.admin = user_uid)
		}
		sync_user_contexts()
	},

	change_users_user_context: function(channel_uid, user_uid, user_context){
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var userContext = channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === user_uid)
			if(userContext !== undefined && user_context.admin !== undefined && Array.isArray(user_context.members)){
				userContext.user_context = user_context
			}
		}
	},

	determine_if_user_is_in_channel: function(channel_uid, user_uid){
		var countFor = 0
		var countAgainst = 0
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			channelContext.user_contexts.forEach((userContext) => {
				if(userContext.members.indexOf(user_uid) !== -1){
					countFor++
				}
				else{
					countAgainst++
				}
			})
		}
		return countFor > countAgainst
	},

	determine_channel_context: function(channel_uid){
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		var decidedUponContext = {
			"admin": []
			"members": []
		}
		if(channelContext !== undefined){
			channelContext.user_contexts.forEach((userContext) => {
				var adminVotes = decidedUponContext.admin.find((admin) => admin.name === userContext.user_context.admin)
				if(adminVotes !== undefined){
					adminVotes.count++
				}
				else{
					decidedUponContext.admin.push({
						"name": userContext.user_context.admin,
						"count": 1
					})
				}

				userContext.user_context.members.forEach((member) => {
					var memberVotes = decidedUponContext.members.find((memberVote) => member.name === member)
					if(memberVotes !== undefined){
						memberVotes.count++
					}
					else{
						decidedUponContext.members.push({
							"name": member,
							"count": 1
						})
					}
				})
			})

			var totalVotes = channelContext.user_contexts.length

			var adminHighestVote = {
				"name": undefined,
				"count": 0
			}
			var finalAdmin = undefined
			decidedUponContext.admin.forEach((admin) => {
				if(admin.count > adminHighestVote.count){
					adminHighestVote = admin
				}
			})
			if(adminHighestVote.count > totalVotes / 2){
				finalAdmin = adminHighestVote.name
			}

			var finalMembers = []
			decidedUponContext.members.forEach((member) => {
				if(member.count > totalVotes/2){
					finalMembers.push(member.name)
				}
			})

			return {
				"admin": finalAdmin,
				"members": finalMembers
			}
		}
	}

	sync_user_contexts: function(){
		contexts.forEach((context) => {
			var decidedUponContext = determine_channel_context(context.channel)
			context.user_contexts.forEach((userContext) => {
				userContext.user_context = decidedUponContext
			})
		})
	}
}

export default ContextManager