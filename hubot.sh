#!/bin/bash

set -e

export PATH="node_modules/.bin:node_modules/hubot/node_modules/.bin:$PATH"
exec node_modules/.bin/hubot -a rocketchat "$@"
