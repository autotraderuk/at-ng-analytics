#!/bin/bash

if [[ :$PATH: == *:"/ciagents/pipelines/$GO_PIPELINE_NAME/tools/node-v0.12.2-linux-x64/bin":* ]]
then
    echo "node:"
    node --version
else
    export PATH=$PATH:/ciagents/pipelines/$GO_PIPELINE_NAME/tools/node-v0.12.2-linux-x64/bin
    echo "node:"
    node --version
fi

node tools/node-v0.12.2-linux-x64/lib/node_modules/npm/bin/npm-cli.js install
node tools/node-v0.12.2-linux-x64/lib/node_modules/npm/bin/npm-cli.js run test