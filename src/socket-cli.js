// https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/

const WebSocket = require('ws');
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    // ws.send('client connected');
});

ws.on('close', () => {
    rl.close();
});

ws.on('error', (error) => {
    console.log(error);
});

ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    if (message.command === 'quit') {
        rl.close();
    } else {
        // console.log(data);
        const contentData = data.content;
        contentData.forEach(element => {
            // console.log(element);
            if (element.text) {
                element.text.forEach(item => {
                    // console.log(item);
                    const content = item.content;
                    if (content && content[0] && content[1]) {
                        // console.log(content);
                        const type = content[0];
                        const value = content[1];
                        // console.log(`${type}: ${value}`);
                        if (type === 'subheader') {
                            console.log(`You are at ${value}`);
                        } else if (type === 'normal') {
                            if (value !== '>') {
                                console.log(`${value}`);
                            }
                        } else {
                            // console.log(`unused type: ${type}`);
                        }
                    } else {
                        // console.log(`invalid content:`, content);
                    }
                });
            } else {
                // console.log(`no element.text`);
            }
        });
        // console.log(JSON.stringify(data, null, 2));
        ask("> ");
    }
});

const ask = (prompt) => {
    rl.question(prompt, function (input) {
        const messageData = {
            type: "message",
            from: {
                id: this._userId
            },
            text: input
        }
        const message = JSON.stringify(messageData);
        ws.send(message);
    });
}

ask("> ");

rl.on("close", function () {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});