const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');
const https = require('https')

let session = {};

const sign = (input) => {
    try {
        const msg = Buffer.from(input, 'utf8');
        const key = Buffer.from('ztsrubrqdz2perfq87hp', 'utf8');
        const hash = crypto.createHmac('sha256', key).update(msg).digest('hex');
        return hash;
    } catch (error) {
        console.error(`Error in sign function: ${error}`);
        return null;
    }
}

const getData = async () => {
    try {
        const data = querystring.stringify({
            security_token: "41776433202696716851634839916005",
            client_version: "9805009546",
            platform: "windows",
            client_language: "en",
            user_id: "3423675007510305942",
            time: Math.floor(Date.now() / 1000),
            bd_payload: crypto.randomInt(10000, 1000000000),
            bd_ers: crypto.randomInt(10000, 1000000000),
            shortClientVersion: "22.10.5",
        });
        const dataSign = sign(data)
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-sp-sign': dataSign,
        };
        const response = await axios({
            method: 'post',
            url: 'https://dcw-p.socialpointgames.com/ilovedragons/user/1/1/login',
            data: data,
            headers: headers,
            maxRedirects: 0,
            timeout: 120000,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            },
        });
        return response;
    } catch (err) {
        console.log(`Error in getData function: ${err}`);
    }
}


const login = async () => {
    try {
        const data = querystring.stringify({
            security_token: "41776433202696716851634839916005",
            client_version: "9805009546",
            platform: "windows",
            client_language: "en",
            user_id: "3423675007510305942",
            time: Math.floor(Date.now() / 1000),
            bd_payload: crypto.randomInt(10000, 1000000000),
            bd_ers: crypto.randomInt(10000, 1000000000),
            shortClientVersion: "22.10.5",
        });
        const dataSign = sign(data)
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-sp-sign': dataSign,
        };
        const response = await axios({
            method: 'post',
            url: `https://dcw-p.socialpointgames.com/ilovedragons/user/${crypto.randomInt(1, 10000)}/qkehJSwOn7zzzoaJFHm86InRXRxJbRzZw4EGLGxpOuw/login`,
            data: data,
            headers: headers,
            maxRedirects: 0,
            timeout: 120000,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            },
        });
        session.firstNumber = 0
        session.sessionId = response.data['login_data']['session_id']
        let items = response.data.game_data.user.map.items
        for (const [find, value] of Object.entries(items)) {
            if ([24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 446, 447, 448, 449, 450, 451].includes(value[0])) {
                session["habitatId"] = find;
                break;
            }
        }
        return response;
    } catch (err) {
        console.log(`Error in login function: ${err}`);
    }
}

const foodCmd = () => {
    const Cmd = {
        "first_number": session.firstNumber + 1,
        "ts": Math.floor(Date.now() / 1000),
        "commands": [],
    };

    for (let i = 0; i <= 299; i++) {
        Cmd.commands.push({
            "cmd": "vip_dragons_collect",
            "urgent": false,
            "args": [session.habitatId, 10],
            "model": [],
            "number": 0,
            "time": Math.floor(Date.now() / 1000),
        });
    }

    for (let i = 0; i <= 299; i++) {
        Cmd.commands[i].number = i + 1;
        session.firstNumber += 1;
    }
    let query = `mobileBundleVersion=9805009546&USERID=${session.id}&user_key=${session.sessionId}&data=${sign(JSON.stringify(Cmd))};${JSON.stringify(Cmd)}&`;
    return query;
}

const reload = async () => {
    try {
        data = foodCmd()
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const response = await axios({
            method: 'post',
            url: 'https://dcw-p.socialpointgames.com/ilovedragons/packet/execution',
            data: data,
            headers: headers,
            maxRedirects: 0,
            timeout: 120000,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            },
        });
        console.log("No Error Occured in try block so food is incremented by 3000");
        session.food += 3000
        await reload()
    } catch (err) {
        console.log(`Error in reload function: ${err}`);
        await login();
        await reload()
    }
}

const main = async () => {
    try {
        let res = await getData();
        res = res.data;
        session = {
            "food": res["game_data"]["user"]["playerInfo"]["food"],
            "cash": res["game_data"]["user"]["playerInfo"]["cash"],
            "gold": res["game_data"]["user"]["playerInfo"]["gold"],
            "xp": res["game_data"]["user"]["playerInfo"]["xp"],
            "securityToken": "41776433202696716851634839916005",
            "sessionId": res["login_data"]["session_id"],
            "id": res["login_data"]["user_id"],
            "firstNumber": 1,
            "login": true
        }
        await login()
        await reload()
    } catch (err) {
        console.log(`Error in main function: ${err}`);
        main()
    }
}

main()
