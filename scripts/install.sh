#!/bin/bash

#remove the lock
set +e
sudo rm /var/lib/dpkg/lock > /dev/null
sudo rm /var/cache/apt/archives/lock > /dev/null
sudo dpkg --configure -a
set -e

sudo apt-get update -y
sudo apt-get install -y haproxy

#make sure nodemiral folder exists
sudo mkdir -p /opt/nodemiral/haproxy

#initial permission
sudo chown -R $USER /opt/nodemiral/haproxy
sudo chown -R $USER /etc/init
