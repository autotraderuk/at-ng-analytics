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

if node tools/node-v0.12.2-linux-x64/lib/node_modules/npm/bin/npm-cli.js publish
then
  echo "publish to nexus complete"
  exit 0
else
  echo "failed to publish to nexus, have you incremented the version number?"
  exit 1
fi 