const fs = require('fs')

class ContextManagerClass {

	get_all_contexts(){
		return JSON.parse(fs.readFileSync('contexts.json'))
	}

	save_all_contexts(contexts){
		fs.writeFileSync('contexts.json', JSON.stringify(contexts))
	}

	add_channel(channel_uid, user_uid){
		var contexts = this.get_all_contexts()
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
		this.save_all_contexts(contexts)
	}

	add_user(channel_uid, user_uid, author_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.user_contexts.find((userContext) => userContext.user === author_uid)
			if(authorContext !== undefined){
				if(!authorContext.user_context.members.includes(user_uid)){
					console.log("user: " + user_uid + "is not already in the channel")
					authorContext.user_context.members.push(user_uid)
					var userToAddContext = channelContext.user_contexts.find((userContext) => userContext.user === user_uid)

					console.log("Setting user context to " + JSON.stringify(authorContext.user_context))
					if(userToAddContext !== undefined){
						userToAddContext.user_context = JSON.parse(JSON.stringify(authorContext.user_context))
					}
					else{
						channelContext.user_contexts.push({
							"user": user_uid,
							"user_context": JSON.parse(JSON.stringify(authorContext.user_context))
						})
					}				
				}
				this.get_relevant_user_contexts(channel_uid, author_uid).forEach((userContext) => {
					if(userContext.user !== authorContext.user){
						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
						var membersDiff = userContext.user_context.members
							.filter(member => !authorContext.user_context.members.includes(member))
							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
						console.log("member diff = " + membersDiff)
						if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && authorContext.user_context.members.includes(user_uid)){
							userContext.user_context = JSON.parse(JSON.stringify(authorContext.user_context))
							console.log("user: " + userContext.user + " context set to: " + JSON.stringify(userContext.user_context))
						}
					}
				})
			}
		}
		this.save_all_contexts(contexts)
	}

	delete_user(channel_uid, user_uid, author_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.user_contexts.find((userContext) => userContext.user === author_uid)
			if(authorContext !== undefined){
				if(authorContext.user_context.members.includes(user_uid)){
					authorContext.user_context.members = authorContext.user_context.members.filter((member) => member !== user_uid)
					channelContext.user_contexts = channelContext.user_contexts.filter((userContext) => userContext.user !== user_uid)
				}
				this.get_relevant_user_contexts(channel_uid, author_uid).forEach((userContext) => {
					if(userContext.user !== authorContext.user){
						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
						var membersDiff = userContext.user_context.members
							.filter(member => !authorContext.user_context.members.includes(member))
							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
						console.log("member diff = " + membersDiff)
						if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && userContext.user_context.members.includes(user_uid)){
							userContext.user_context = JSON.parse(JSON.stringify(authorContext.user_context))
							console.log("user: " + userContext.user + " context set to: " + JSON.stringify(userContext.user_context))
						}
					}
				})
			}
		}
		this.save_all_contexts(contexts)
	}

	change_admin(channel_uid, user_uid, author_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.user_contexts.find((userContext) => userContext.user === author_uid)
			if(authorContext !== undefined){
				if(authorContext.user_context.members.includes(user_uid)){
					authorContext.user_context.admin = user_uid
				}
				this.get_relevant_user_contexts(channel_uid, author_uid).forEach((userContext) => {
					if(userContext.user !== authorContext.user){
						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
						var membersDiff = user_context.user_context.members
							.filter(member => !authorContext.user_context.members.includes(member))
							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
						if(!isAdminMatch && membersDiff.length === 0){
							userContext.user_context = JSON.parse(JSON.stringify(authorContext.user_context))
						}
					}
				})
			}
		}
		this.save_all_contexts(contexts)
	}

	change_users_user_context(channel_uid, user_uid, user_context){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var userContext = channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === user_uid)
			if(userContext !== undefined && user_context.admin !== undefined && Array.isArray(user_context.members)){
				userContext.user_context = user_context
			}
		}
		this.save_all_contexts(contexts)
	}

	get_relevant_user_contexts(channel_uid, author_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === author_uid)
			if(authorContext !== undefined){
				console.log("Relevant Contexts are: " + JSON.stringify(channelContext.user_contexts.filter((userContext) => authorContext.user_context.members.includes(userContext.user))))
				return channelContext.user_contexts.filter((userContext) => authorContext.user_context.members.includes(userContext.user))
			}
		}
		return []
	}

	get_user_context(channel_uid, user_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			let userContext = channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === user_uid)
			if(!userContext) {
				return null
			}
			return userContext.user_context
		}
		return undefined
	}

}

const ContextManager = new ContextManagerClass()

module.exports = ContextManager;
