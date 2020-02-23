/* guilds */
Vue.component('guilds', {
    props: ['guild'],
    computed: {
        avatarImg() {
            return `background-image: url(${this.guild.ownerAvatarURL})`;
        },
        iconImg() {
            return `background-image: url(${this.guild.icon})`;
        }
    },
    template: `<div class="guild-item" v-on:click="click"><div class="guild-icon" v-bind:style="iconImg"></div><div class="guild-info"><span class="guild-name">{{guild.name}}</span><div class="guild-owner"><div class="owner-avatar" v-bind:style="avatarImg"></div><span class="owner-name">{{guild.owner}}</span></div></div></div>`,
    methods: {
        click() {
            document.querySelectorAll('.section').forEach(f => {
                f.classList.add('hidden');
            });
            sectionName.sectionName = this.guild.name
            document.querySelector(`.guildTab`).classList.remove('hidden');
        }
    }
});

let guildsCom = new Vue({
    el: '.guilds',
    data: {
        guilds: []
    }
});

let sectionName = new Vue({
    el: '.section-name',
    data: {
        sectionName: 'Your Bot'
    }
})

let errorMsg = new Vue({
    el: '.error-msg',
    data: {
        errMsg: 'None'
    }
})

let getGuildInfo = () => {
    guildsCom.guilds = [];
    fetch('http://localhost:3000/api/guilds').then(response => {
        if (response.status != 200) {
            console.log(`Unable to fetch guilds! Status: ${response.status}`);
            return;
        }
        response.json().then(data => {
            data.forEach((f, i) => {
                fetch(`http://localhost:3000/api/guilds/${f}`).then(resp => {
                    if (resp.status != 200) {
                        console.log(`Unable to fetch guild data! Status: ${resp.status}`);
                        return;
                    }
                    resp.json().then(guildData => {
                        fetch(`http://localhost:3000/api/guilds/${f}/member/${guildData.ownerID}`).then(userResp => {
                            if (userResp.status != 200) {
                                console.log(`Unable to fetch guild owner data! Status: ${userResp.status}`);
                                return;
                            }
                            userResp.json().then(memberData => {
                                guildsCom.guilds.push({
                                    name: guildData.name,
                                    icon: guildData.iconURL,
                                    owner: `${memberData.name}#${memberData.discriminator}`,
                                    ownerAvatarURL: memberData.avatarURL,
                                    id: f
                                });
                            })
                        })
                    })
                })
            })
        })
    }).catch(err => {
        console.error(err);
    });
}

let getBotInfo = () => {
    fetch('http://localhost:3000/api/client').then(response => {
        if (response.status != 200) {
            console.log('Unable to get client info!');
            return;
        }
        response.json().then(data => {
            botInfo.name.name = data.username;
            botInfo.name.discriminator = data.discriminator;
            botInfo.id = data.id;
            shinkaVer.ver = `v${data.ver}`;
            document.querySelector('.bot-avatar').style.backgroundImage = `url(${data.avatarURL})`
        })
    })
    fetch('http://localhost:64342/status').then(resp => {
        let statusIcon = document.querySelector('.status-icon');
        let statusIconEffect = document.querySelector('.status-icon-effect');
        if (resp.status != 200) {
            botInfo.online = 'Offline';
            statusIcon.classList.remove('online');
            statusIconEffect.classList.remove('online');
        } else {
            botInfo.online = 'Online';
            statusIcon.classList.add('online');
            statusIconEffect.classList.add('online');
        }
    }).catch(err => {
        let statusIcon = document.querySelector('.status-icon');
        let statusIconEffect = document.querySelector('.status-icon-effect');
        botInfo.online = 'Offline';
        statusIcon.classList.remove('online');
        statusIconEffect.classList.remove('online');
    })
};
getBotInfo();
getGuildInfo();

let hideInput = el => {
    el.target.classList.add('hidden');
    let input = document.querySelector('.info-input');
    input.value = botInfo.name.name;
    input.classList.remove('hidden');
}

let updateUsername = (evt) => {
    evt.target.classList.add('hidden');
    document.querySelector('.hidden-input').classList.remove('hidden');
    let name = evt.target.value;
    fetch('http://localhost:3000/api/client/updateUsername', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name})
    }).then(response => {
        return response.json();
    }).then(result => {
        if (result.status == 'OK') {
            getBotInfo();
        } else {
            errorMsg.errMsg = result.err;
            let errMsgPop = document.querySelector('.err-msg-container');
            errMsgPop.classList.remove('hidden');
            setTimeout(() => {
                errMsgPop.classList.add('hidden');
            }, 5000)
        }
    })
}

/* side bar buttons */
Vue.component('side-buttons', {
    props: ['button'],
    template: '<div class="item-sidebar" v-on:click="click"><div class="active-indicator"></div><i class="material-icons">{{ button.icon }}</i><span>{{ button.name }}</span></div>',
    methods: {
        click() {
            let tabClicked = this.$vnode.key;
            document.querySelector('.item-sidebar.active .active-indicator').style.display = 'none';
            document.querySelector('.item-sidebar.active').classList.remove('active')
            this.$el.classList.add('active');
            document.querySelector('.item-sidebar.active .active-indicator').style.display = 'block';
            document.querySelectorAll('.section').forEach(f => {
                f.classList.add('hidden');
            });
            document.querySelector(`.${tabClicked}`).classList.remove('hidden');
            switch(tabClicked) {
                case "overviewTab":
                    sectionName.sectionName = 'Your Bot';
                    getBotInfo();
                    break;
                case "commandsTab":
                    sectionName.sectionName = 'Commands';
                    break;
                case "helpTab":
                    sectionName.sectionName = 'Help & Info';
                    break;
            }
        }
    },
    mounted() {
        if (this.$vnode.key == 'overviewTab') {
            this.$el.classList.add('active');
            document.querySelector('.item-sidebar.active .active-indicator').style.display = 'block';
        }
    }
});

let sideButtons = new Vue({
    el: '.nav-buttons',
    data: {
        section1: [
            {icon: 'info', name: 'Overview', id: 'overviewTab'},
            {icon: 'code', name: 'Commands', id: 'commandsTab'},
            {icon: 'help', name: 'Help & Info', id: 'helpTab'}
        ]
    }
});

let shinkaVer = new Vue({
    el: '.shinka-info',
    data: {
        ver: 'v0.0.0'
    }
})

let botInfo = new Vue({
    el: '.bot-info',
    data: {
        name: {
            name: 'Bot',
            discriminator: '0000'
        },
        id: 'id',
        online: 'Offline'
    }
});

let botAvatarHover = new Vue({
    el: '.bot-avatar',
    methods: {
        hover() {
            document.querySelector('.bot-avatar-hover').classList.remove('hidden');
        },
        leave() {
            document.querySelector('.bot-avatar-hover').classList.add('hidden');
        }
    }
});

let updateAvatar = (image) => {
    let reader = new FileReader();
    reader.onload = function() {
        postAvatar(reader.result);
    }
    reader.readAsDataURL(image.target.files[0]);
}

let postAvatar = (image) => {
    fetch('http://localhost:3000/api/client/updateAvatar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({image: image})
    }).then(response => {
        return response.json();
    }).then(result => {
        if (result.status == 'OK') {
            getBotInfo();
        } else {
            errorMsg.errMsg = result.err;
            let errMsgPop = document.querySelector('.err-msg-container');
            errMsgPop.classList.remove('hidden');
            setTimeout(() => {
                errMsgPop.classList.add('hidden');
            }, 5000)
        }
    })
}