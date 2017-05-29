
let thisGroupChatManager;
let thisChatController;
let thisChatURL;
let thisGroupName;

document.getElementById("create_chat").onclick = function() {

    rethink.default.install({
        domain: 'hysmart.rethink.ptinovacao.pt',
        development: true,
        runtimeURL: 'hyperty-catalogue://catalogue.hysmart.rethink.ptinovacao.pt/.well-known/runtime/Runtime'
    }).then((runtime) => {
        console.log("inside runtime");

        runtime.requireHyperty(getHypertyURL('hysmart.rethink.ptinovacao.pt', 'GroupChatManager'))
            .then((GroupChatManager) => {
                thisGroupChatManager = GroupChatManager;
                const name = document.getElementById("name").value;
                const emails = [document.getElementById("emails").value];
                const domains = [document.getElementById("domains").value];
                thisGroupName = name;
                GroupChatManager.instance.create(name, emails, domains)
                    .then((chatController) => {
                        console.log("inside create");
                        thisChatController = chatController;
                        thisChatURL = chatController.dataObject.url;
                        setupChatGroup();
                    })
                    .then(() =>
                    {
                        GroupChatManager.instance.join(thisChatURL)
                            .then((chatController) => {
                                console.log("inside join");
                            });
                    } );


            });
    });
};


function getHypertyURL(hypertyDomain, hypertyName){
    return 'hyperty-catalogue://catalogue.' + hypertyDomain + '/.well-known/hyperty/' + hypertyName;
}

function inviteUser() {
    console.log("inside invite");
    const users = [document.getElementById("emails").value];
    thisChatController.addUser(users,[]);
    console.log("Added user/s :");
}

function sendMessage(){
    console.log('[ Group '+thisGroupName+' ] Sending message -> +event');
    thisChatController.send(document.getElementById("message").value)
        .catch(reason => console.log("Error on sending a message",reason));
    console.log('[ Group '+thisGroupName+' ] Message sent with success');
}


function setupChatGroup(){

    thisGroupChatManager.instance.onInvitation((event) =>
    {
        console.log('[ Group '+thisGroupName+' ] Received an invitation to join a chat ->' +event);
        thisGroupChatManager.instance.join(event.url).then((chatController) =>
        {
          thisChatController = chatController;
          updateCallBacks(chatController);
        }).catch(reason => console.log("Error on invitation",reason));
        console.log('[ Group '+thisGroupName+' ] Joined Group with success')
    });

    thisChatController.onUserAdded((event) =>
    {
        console.log('[ Group '+thisGroupName+' ] Add a new user:', event);
    });

    thisChatController.onUserRemoved((event) =>
    {
        console.log('[ Group '+thisGroupName+' ] Remove a user:', event);
    });

    thisChatController.onMessage((message) =>
    {
        console.info('[ Group '+thisGroupName+' ] new message received: ', message.content);
    });

}

function updateCallBacks(chatController){

    chatController.onUserAdded((event) =>
    {
        console.log('[ Group '+thisGroupName+' ] Add a new user:', event);
    });

    chatController.onUserRemoved((event) =>
    {
        console.log('[ Group '+thisGroupName+' ] Remove a user:', event);
    });

    chatController.onMessage((message) =>
    {
        console.info('[ Group '+thisGroupName+' ] new message received: ', message.content);
    });

}
