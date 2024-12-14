![Staging-Master-branch Build and Deploy](https://github.com/Grkweb/grkweb-app-ui/workflows/Staging-Master-branch%20Build%20and%20Deploy/badge.svg)

![Production-branch Build and Deploy](https://github.com/Grkweb/grkweb-app-ui/workflows/Production-branch%20Build%20and%20Deploy/badge.svg)

<br>

# API

POST https://pictionary-grkweb.herokuapp.com/pictionary/v1/create_room

Response:
```java
{
    "roomId": "fbe51874-ba41-4e72-944f-b32e20e30293"
}
```


<br><br>

# Pictionary - Message types Documentation
By default all the communication from server to client is a broadcast.<br>

| SENDER | TO                        | MessageType        | Response to SENDER                                                                        | Response to ALL <br>(Including SENDER)                                            | DESC                                      |
|--------|---------------------------|--------------------|-------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|-------------------------------------------|
| SERVER | Client                    | ROOM_NOT_AVAILABLE |                                                                                           |                                                                                   | Terminate the session from client         |
| Client | SERVER                    | UNDO_CANVAS<br>    | -                                                                                         | UNDO_CANVAS                                                                       | Inform the server to undo previous change |
| SERVER | Client                    | CLEAR_CANVAS       | -                                                                                         | CLEAR_CANVAS                                                                      | Clear the canvas                          |
| Client | SERVER                    | WHO_AM_I           | WHO_AM_I<br>GAME_STATE                                                                    | USER_CONNECTED <br><br>ROOM_NOT_AVAILABLE  (Broadcasted if room is not available) |                                           |
| SERVER | Client                    | USER_CONNECTED     | -                                                                                         | -                                                                                 | -                                         |
| SERVER | Client                    | USER_DISCONNECTED  | -                                                                                         | -                                                                                 | -                                         |
| Client | SERVER                    | CHAT               | -                                                                                         | CHAT<br>(or)<br> GUESSED_WORD                                                     | -                                         |
| Client | SERVER                    | START_GAME         | CHOOSE_WORD (Will be sent to a single client choosen by server based on the current turn) | GAME_STARTED<br>CLEAR_CANVAS<br>GAME_STATE_UPDATE<br>                             | -                                         |
| SERVER | Client (To specific user) | CHOOSE_WORD        | CHOSEN_WORD                                                                               | CLUE (To all clients from server)                                                 |                                           |
| SERVER | Client                    | GAME_STARTED       |                                                                                           |                                                                                   |                                           |
| SERVER | Client                    | GAME_OVER          |                                                                                           |                                                                                   |                                           |
| SERVER | Client                    | GAME_STATE_UPDATE  |                                                                                           |                                                                                   |                                           |
| Client | SERVER                    | CANVAS_UPDATE      |                                                                                           | CANVAS_UPDATE                                                                     |                                           |



<br><br>
| Message Type      | Client to Server                                                                                                                                                                                                                                                                          | Server to client                                                                                                                                                                                                                                                                                                                                               |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| WHO_AM_I          | {"messageType":"WHO_AM_I","content":"{\"displayName\":\"as\"}"}                                                                                                                                                                                                                           | {"messageType":"WHO_AM_I","originId":"c6dbcb5f-5898-445c-a9ae-b6264feda8ba","content":{"displayName":"Grk","wsSessionId":"rx5frnz4","userId":"c6dbcb5f-5898-445c-a9ae-b6264feda8ba","lobbyId":"friendshub","active":true,"connected":true,"currentPlayer":false}}                                                                                              |
| USER_CONNECTED    |                                                                                                                                                                                                                                                                                           | {"messageType":"USER_CONNECTED","originId":"5cab396b-00a3-44af-a570-c96929de922a","content":{"displayName":"as","wsSessionId":"ihnvi5pk","userId":"5cab396b-00a3-44af-a570-c96929de922a","lobbyId":"friendshub","active":true,"connected":true,"currentPlayer":false}}                                                                                         |
| USER_DISCONNECTED |                                                                                                                                                                                                                                                                                           | {"messageType":"USER_DISCONNECTED","originId":"app","content":{"displayName":"as","wsSessionId":"x10fmmvs","userId":"85615212-83ef-4897-887d-ac31b74e8d99","lobbyId":"friendshub","active":false,"connected":false,"currentPlayer":false}}                                                                                                                     |
| GAME_STATE        | -                                                                                                                                                                                                                                                                                         | {"messageType":"GAME_STATE","originId":"c6dbcb5f-5898-445c-a9ae-b6264feda8ba","content":{"gameState":"LOBBY","levelTimeout":null,"gameConfig":{"levelTimeout":60},"activeUsers":[{"displayName":"Grk","wsSessionId":"rx5frnz4","userId":"c6dbcb5f-5898-445c-a9ae-b6264feda8ba","lobbyId":"friendshub","active":true,"connected":true,"currentPlayer":false}]}} |
| START_GAME        | {"messageType":"START_GAME","content":"{\"levelTimeout\":60}"}                                                                                                                                                                                                                            |                                                                                                                                                                                                                                                                                                                                                                |
| GAME_STARTED      |                                                                                                                                                                                                                                                                                           | {"messageType":"GAME_STARTED","originId":"app","content":{"gameConfig":{"levelTimeout":60}}}                                                                                                                                                                                                                                                                   |
| CLEAR_CANVAS      |                                                                                                                                                                                                                                                                                           | {"messageType":"CLEAR_CANVAS","originId":"app","content":null}                                                                                                                                                                                                                                                                                                 |
| UNDO_CANVAS       | {"messageType":"UNDO_CANVAS"}                                                                                                                                                                                                                                                             | {"messageType":"UNDO_CANVAS","originId":"5cab396b-00a3-44af-a570-c96929de922a","content":null}                                                                                                                                                                                                                                                                 |
| GAME_OVER         |                                                                                                                                                                                                                                                                                           | {"messageType":"GAME_OVER","originId":"app","content":null}                                                                                                                                                                                                                                                                                                    |
| GAME_STATE_UPDATE |                                                                                                                                                                                                                                                                                           | {"messageType":"GAME_STATE_UPDATE","originId":"app","content":{"currentPlayer":"85615212-83ef-4897-887d-ac31b74e8d99"}}                                                                                                                                                                                                                                        |
| CHOOSE_WORD       |                                                                                                                                                                                                                                                                                           | {"messageType":"CHOOSE_WORD","originId":"app","content":{"words":["Keychain","hat","fridge"]}}                                                                                                                                                                                                                                                                 |
| CHOSEN_WORD       | {"messageType":"CHOSEN_WORD","content":"{\"chosenWord\":\"muffin\"}"}                                                                                                                                                                                                                     |                                                                                                                                                                                                                                                                                                                                                                |
| CLUE              |                                                                                                                                                                                                                                                                                           | {"messageType":"CLUE","originId":"app","content":{"clue":"______"}}                                                                                                                                                                                                                                                                                            |
| CANVAS_UPDATE     | {"messageType":"CANVAS_UPDATE","content":"㞂‶ॠ瘊惎‗Ƶ䀇ϛ䀮२ò䁆Ƙàڄļ逓麀…Ř״낒⺧儣᛭뫱ёᤀ䠀恚㎏㻓䠃枝⅀ᘕ郣뢻䍫⟵♸덖ꨥ䬦쳛ݢ경景狇⍫ൢ㌎¯松Գ䴈ꝣ刘\uda12䵍䬨贷ᓩᥴ샯總㍲戌쒪᳢牏Ӡ抪塚죣๬ꄶ絲鬒傜ꂗᥓ䇢๞霚鴶滩ꑮ똲苌隣껎䗄㙒稹\udd8d⚝꧓꼀嵪#'W㠀଀愌「⯉Ȇ禀c5蠅铁\u0013ࠧ줌ꛡ㱀w࠲㬅倆弘Ѐ๥ኴ尠\u0000"} | {"messageType":"CANVAS_UPDATE","originId":"fe9b0b27-d755-498a-a8e9-306721ee65d3","content":"㞂‶ॠ瘊惎‗Ƶ䀇ϛ䀮२ò䁆Ƙàڄļ逓麀…Ř״낒⺧儣᛭뫱ёᤀ䠀恚㎏㻓䠃枝⅀ᘕ郣뢻䍫⟵♸덖ꨥ䬦쳛ݢ경景狇⍫ൢ㌎¯松Գ䴈ꝣ刘\uda12䵍䬨贷ᓩᥴ샯總㍲戌쒪᳢牏Ӡ抪塚죣๬ꄶ絲鬒傜ꂗᥓ䇢๞霚鴶滩ꑮ똲苌隣껎䗄㙒稹\udd8d⚝꧓꼀嵪#'W㠀଀愌「⯉Ȇ禀c5蠅铁\u0013ࠧ줌ꛡ㱀w࠲㬅倆弘Ѐ๥ኴ尠\u0000"}                    |
<br><br><br><br><br>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start` 

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test` 

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build` 

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject` 

**Note: this is a one-way operation. Once you `eject` , you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject` . The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
