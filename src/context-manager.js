const fs = require('fs')

class ContextManagerClass {

	get_all_contexts(){
		return JSON.parse(fs.readFileSync('contexts.json'))
	}

	save_all_contexts(contexts){
		console.log("saving: " + JSON.stringify(contexts, null, 2))
		fs.writeFileSync('contexts.json', JSON.stringify(contexts))
	}

	add_channel(channel_uid, user_uid){
		var contexts = this.get_all_contexts()
		var userContext = contexts.find((context) => context.user === user_uid)
		if(userContext === undefined){
			contexts.push({
				"user": user_uid,
				"channel_contexts": [{
					"channel": channel_uid,
			        "user_context": {
			        	"admin": user_uid,
			        	"members": [
			            	user_uid
			          	],
			          	"active_votes": [],
			          	"contextChain": {
			          		"admin": user_uid,
			          		"members": [
				            	user_uid
				          	],
				          	"supporting_vote": undefined,
				          	"previous_chain": undefined
			          	}
			        }
				}]
			})
		}
		else{
			userContext.channel_contexts.push({
				"channel": channel_uid,
		        "user_context": {
		        	"admin": user_uid,
		        	"members": [
		            	user_uid
		          	],
		          	"active_votes": [],
		          	"contextChain": {
		          		"admin": user_uid,
		          		"members": [
			            	user_uid
			          	],
			          	"supporting_vote": undefined,
			          	"previous_chain": undefined
		          	}
		        }
			})
		}
		this.save_all_contexts(contexts)
	}

	add_user(channel_uid, user_uid, author_uid){
		var contexts = this.get_all_contexts()
		var authorContext = this.get_user_context_with_contexts_defined(contexts, channel_uid, author_uid)
		if(authorContext !== undefined){
			if(!authorContext.members.includes(user_uid)){
				authorContext.members.push(user_uid)
				var newMemberContext = this.get_user_context_with_contexts_defined(contexts, channel_uid, user_uid)
				if(newMemberContext === undefined){
					newMemberContext = contexts.find((context) => context.user === user_uid)
					if(newMemberContext === undefined){
						contexts.push({
							"user": user_uid,
							"channel_contexts": [{
								"channel": channel_uid,
						        "user_context": JSON.parse(JSON.stringify(authorContext))
							}]
						})
					}
					else{
						var channelContext = newMemberContext.channel_contexts.find((channel) => channel.channel === channel_uid)
						if(channel_contexts === undefined){
							newMemberContext.channel_contexts.push({
								"channel": channel_uid,
						        "user_context": JSON.parse(JSON.stringify(authorContext))
							})
						}						
					}
				}
			}
			this.get_relevant_user_contexts(contexts, channel_uid, author_uid).forEach((userContext) => {
				var isAdminMatch = userContext.admin === authorContext.admin
				var membersDiff = userContext.members
					.filter(member => !authorContext.members.includes(member))
					.concat(authorContext.members.filter(member => !userContext.members.includes(member)))
				if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && authorContext.user_context.members.includes(user_uid)){
					userContext = JSON.parse(JSON.stringify(authorContext))					
				}
			})
		}
		this.save_all_contexts(contexts)
	}

	delete_user(channel_uid, user_uid, author_uid){
		var contexts = this.get_all_contexts()
		var authorContext = this.get_user_context_with_contexts_defined(contexts, channel_uid, author_uid)
		if(authorContext !== undefined){
			if(authorContext.members.includes(user_uid)){
				authorContext.members = authorContext.members.filter((member) => member !== user_uid)
			}
			this.get_relevant_user_contexts(contexts, channel_uid, author_uid).forEach((userContext) => {
				var isAdminMatch = userContext.admin === authorContext.admin
				var membersDiff = userContext.members
					.filter(member => !authorContext.members.includes(member))
					.concat(authorContext.members.filter(member => !userContext.members.includes(member)))
				if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && userContext.members.includes(user_uid)){
					userContext = JSON.parse(JSON.stringify(authorContext))
				}
			})
		}
		this.save_all_contexts(contexts)
	}

	change_admin(channel_uid, user_uid, author_uid){
		var contexts = this.get_all_contexts()
		var authorContext = this.get_user_context_with_contexts_defined(contexts, channel_uid, author_uid)
		if(authorContext !== undefined){
			if(authorContext.members.includes(user_uid)){
				authorContext.admin = user_uid
			}
			this.get_relevant_user_contexts(contexts, channel_uid, author_uid).forEach((userContext) => {
				var isAdminMatch = userContext.admin === authorContext.admin
				var membersDiff = userContext.members
					.filter(member => !authorContext.members.includes(member))
					.concat(authorContext.members.filter(member => !userContext.members.includes(member)))
				if(!isAdminMatch && membersDiff.length === 0){
					userContext = JSON.parse(JSON.stringify(authorContext))
				}
			})
		}
		this.save_all_contexts(contexts)
	}

	change_users_user_context(channel_uid, user_uid, user_context){
		var contexts = this.get_all_contexts()
		var authorContext = contexts.find((context) => context.user === user_uid)
		if(userContext !== undefined){
			var channelContext = authorContext.channel_contexts.find((channel) => channel.channel === channel_uid)
			if(channelContext !== undefined){
				channelContext.user_context = user_context
			}
		}
		this.save_all_contexts(contexts)
	}

	get_relevant_user_contexts(contexts, channel_uid, author_uid){
		var authorContext = this.get_user_context_with_contexts_defined(contexts, channel_uid, author_uid)
		if(authorContext !== undefined){
			var toReturn = []
			authorContext.members.forEach((member) => {
				var memberContext = this.get_user_context_with_contexts_defined(contexts, channel_uid, member)
				if(memberContext !== undefined && member !== author_uid){
					toReturn.push(memberContext)
				}
			})
			console.log("Relevant Contexts are: " + JSON.stringify(toReturn))
			return toReturn
		}
		return []
	}

	get_user_context(channel_uid, user_uid){
		var contexts = this.get_all_contexts()
		return this.get_user_context_with_contexts_defined(contexts, channel_uid, user_uid)
	}

	get_user_context_with_contexts_defined(contexts, channel_uid, user_uid){
		var userContext = contexts.find((context) => context.user === user_uid)
		if(userContext !== undefined){
			var channelContext = userContext.channel_contexts.find((channel) => channel.channel === channel_uid)
			if(channelContext !== undefined){
				return channelContext.user_context
			}
		}
		return undefined
	}

}

const ContextManager = new ContextManagerClass()

module.exports = ContextManager;
