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
            membersList.members = [];
            document.querySelectorAll('.section').forEach(f => {
                f.classList.add('hidden');
            });
            fetch(`http://${window.location.hostname}:3000/api/guilds/${this.guild.id}/members`).then(response => {
                if (response.status != 200) {
                    return console.log('Unable to fetch members!')
                }
                response.json().then(data => {
                    data.forEach(f => {
                        let nickname = "shinkaNoNickname";
                        let avatar = `https://cdn.discordapp.com/avatars/${f.user.id}/${f.user.avatar}.png`;
                        if (f.nick) {
                            nickname = f.nick;
                        }
                        if (f.user.avatar == null) {
                            avatar = `https://cdn.discordapp.com/embed/avatars/${f.user.discriminator % 5}.png`
                        }
                        membersList.members.push({
                            name: f.user.username,
                            discriminator: f.user.discriminator,
                            userId: f.user.id,
                            nickname: nickname,
                            avatar: avatar
                        })
                    })
                    simpleSort(membersList.members, 'name');
                })
            })
            sectionName.sectionName = this.guild.name;
            guildInfo.owner.name = this.guild.owner;
            guildInfo.owner.id = this.guild.ownerId;
            guildInfo.id = this.guild.id;
            document.querySelector('.guild-icon-main').style.backgroundImage = `url('${this.guild.icon}')`
            document.querySelector(`.guildTab`).classList.remove('hidden');
        }
    }
});

Vue.component('members', {
    props: ['member'],
    computed: {
        avatarImg() {
            return `background-image: url('${this.member.avatar}')`; 
        },
        checkNick() {
            if (this.member.nickname == 'shinkaNoNickname') {
                return 'display: none;'
            }
        }
    },
    template: '<div class="member-item"><div class="members-container"><div class="member-avatar" v-bind:style="avatarImg"></div><div class="member-info"><span class="member-username">{{member.name}}#{{member.discriminator}}</span><span class="member-bold" v-bind:style="checkNick">Nickname: <span>{{member.nickname}}</span></span><span class="member-bold">ID: <span>{{member.userId}}</span></span></div></div></div>'
})

let membersList = new Vue({
    el: '.members-list',
    data: {
        members: []
    }
})

let guildInfo = new Vue({
    el: '.bot-info.guild',
    data: {
        owner: {
            name: 'Owner#0000',
            id: 'owner id'
        },
        id: "id"
    }
})

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
    fetch(`http://${window.location.hostname}:3000/api/guilds`).then(response => {
        if (response.status != 200) {
            console.log(`Unable to fetch guilds! Status: ${response.status}`);
            return;
        }
        response.json().then(data => {
            data.forEach((f, i) => {
                fetch(`http://${window.location.hostname}:3000/api/guilds/${f}`).then(resp => {
                    if (resp.status != 200) {
                        console.log(`Unable to fetch guild data! Status: ${resp.status}`);
                        return;
                    }
                    resp.json().then(guildData => {
                        fetch(`http://${window.location.hostname}:3000/api/guilds/${f}/member/${guildData.ownerID}`).then(userResp => {
                            if (userResp.status != 200) {
                                console.log(`Unable to fetch guild owner data! Status: ${userResp.status}`);
                                return;
                            }
                            userResp.json().then(memberData => {
                                guildsCom.guilds.push({
                                    name: guildData.name,
                                    icon: guildData.iconURL,
                                    owner: `${memberData.name}#${memberData.discriminator}`,
                                    ownerId: guildData.ownerID,
                                    ownerAvatarURL: memberData.avatarURL,
                                    id: f,
                                    memberCount: guildData.memberCount
                                });
                                simpleSort(guildsCom.guilds, 'name');
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
    fetch(`http://${window.location.hostname}:3000/api/client`).then(response => {
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
    fetch(`http://${window.location.hostname}:64342/status`).then(resp => {
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

let simpleSort = (array, sortBy) => {
    function compare(a, b) {
        if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
        if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
    }
    return array.sort(compare);
}

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
    fetch(`http://${window.location.hostname}:3000/api/client/updateUsername`, {
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
            mobileMenu.openclose();
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

let mobileMenu = new Vue({
    el: '.mobile-menu',
    methods: {
        openclose() {
            let sidebar = document.querySelector('.app-side-bar');
            let menuAppear = document.querySelector('.menu-appear');
            if (this.active == false) {
                sidebar.classList.add('active');
                menuAppear.classList.add('active');
                this.active = true
            } else {
                sidebar.classList.remove('active');
                menuAppear.classList.remove('active');
                this.active = false;
            }
        }
    },
    data: {
        active: false
    }
});

document.querySelector('.menu-appear').addEventListener('click', () => {
    mobileMenu.openclose();
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
    fetch(`http://${window.location.hostname}:3000/api/client/updateAvatar`, {
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