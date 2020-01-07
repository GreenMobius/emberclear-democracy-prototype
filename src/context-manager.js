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

	add_user: function(channel_uid, user_uid, author_uid){
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.find((userContext) => userContext.user = author_uid)
			if(authorContext !== undefined){
				if(authorContext.user_context.members.find(user_uid) === undefined){
					authorContext.user_context.members.push(user_uid)
				}
				channelContext.forEach((userContext) => {
					if(userContext.user !== authorContext.user){
						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
						var membersDiff = user_context.user_context.members
							.filter(member => !authorContext.user_context.members.includes(member))
							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
						if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && authorContext.user_context.members.includes(user_uid)){
							userContext.user_context = authorContext.user_context
						}
					}					
				})
			}
		}
	},

	delete_user: function(channel_uid, user_uid, author_uid){
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.find((userContext) => userContext.user = author_uid)
			if(authorContext !== undefined){
				if(authorContext.user_context.members.find(user_uid) !== undefined){
					var userMemberIndex = authorContext.user_context.members.findIndex((member) => member === user_uid)
					if(userMemberIndex !== -1){
						authorContext.user_context.members.splice(userMemberIndex, 1)
					}
				}
				channelContext.forEach((userContext) => {
					if(userContext.user !== authorContext.user){
						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
						var membersDiff = user_context.user_context.members
							.filter(member => !authorContext.user_context.members.includes(member))
							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
						if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && userContext.user_context.members.includes(user_uid)){
							userContext.user_context = authorContext.user_context
						}
					}					
				})
			}
		}
	},

	change_admin: function(channel_uid, user_uid, author_uid){
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.find((userContext) => userContext.user = author_uid)
			if(authorContext !== undefined){
				if(authorContext.user_context.members.includes(user_uid)){
					authorContext.user_context.admin = user_uid
				}
				channelContext.forEach((userContext) => {
					if(userContext.user !== authorContext.user){
						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
						var membersDiff = user_context.user_context.members
							.filter(member => !authorContext.user_context.members.includes(member))
							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
						if(!isAdminMatch && membersDiff.length === 0){
							userContext.user_context = authorContext.user_context
						}
					}
				})
			}
		}
	},

	change_users_user_context: function(channel_uid, user_uid, user_context){
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var userContext = channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === user_uid)
			if(userContext !== undefined && user_context.admin !== undefined && Array.isArray(user_context.members)){
				userContext.user_context = user_context
			}
		}
<<<<<<< HEAD
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
			"admin": [],
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
	},

	sync_user_contexts: function(){
		contexts.forEach((context) => {
			var decidedUponContext = determine_channel_context(context.channel)
			context.user_contexts.forEach((userContext) => {
				userContext.user_context = decidedUponContext
			})
		})
=======
>>>>>>> gh-pages
	}
}

module.exports = ContextManager;