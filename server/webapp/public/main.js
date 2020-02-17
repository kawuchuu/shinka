

Vue.component('guilds', {
    props: ['guild'],
    template: `<li>{{guild.name}}<br>Owner: {{guild.owner}}</li>`
});

let guildsCom = new Vue({
    el: 'ul.guilds',
    data: {
        guilds: []
    }
})

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
                                owner: `${memberData.name}#${memberData.discriminator}`
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