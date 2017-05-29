
let thisGroupChatManager;
let thisChatController;

rethink.default.install({
    domain: 'hysmart.rethink.ptinovacao.pt',
    development: true,
    runtimeURL: 'hyperty-catalogue://catalogue.hysmart.rethink.ptinovacao.pt/.well-known/runtime/Runtime'
}).then((runtime) =>
    {
    console.log("inside runtime");

    runtime.requireHyperty(getHypertyURL('hysmart.rethink.ptinovacao.pt', 'GroupChatManager'))
        .then((GroupChatManager) =>
        {
            console.log("inside ChatManager");
            thisGroupChatManager = GroupChatManager;
            GroupChatManager.instance.onInvitation((event) =>
            {
                console.log('Received an invitation to join a chat ->' + event);
                thisGroupChatManager.instance.join(event.url).then((chatController) =>
                {
                    thisChatController = chatController;
                    updateCallBacks(chatController);
                }).catch(reason => console.log("Error on invitation", reason));
                console.log('Joined Group with success')
            });
        });
    });

function getHypertyURL(hypertyDomain, hypertyName){
    return 'hyperty-catalogue://catalogue.' + hypertyDomain + '/.well-known/hyperty/' + hypertyName;
}

function updateCallBacks(chatController){

    chatController.onUserAdded((event) =>
    {
        console.log('Add a new user:', event);
    });

    chatController.onUserRemoved((event) =>
    {
        console.log('Remove a user:', event);
    });

    chatController.onMessage((message) =>
    {
        console.info('New message received: ', message.value.content);
        document.getElementById("display").innerHTML += '<p>'+message.identity.userProfile.cn+': '+message.value.content+'</p>';
    });

}
