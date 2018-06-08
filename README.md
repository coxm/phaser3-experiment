# Phaser3 experiment
This is a simple experiment with Phaser 3. The intention is to learn, not to
create something amazing.

## Getting started
Run the following;

    npm install # Or `yarn`. Whatever floats your boat.
    npm run start # Sets up a server at localhost:3000
    $BROWSER localhost:3000

Dist builds can be created using

    npm run build

This creates a dist build in `build/dist`, with a source map at
`build/index.js.map`.

## Other notes
This project uses webpack; the configuration, along with devserver and build
script are in the `script` directory.
