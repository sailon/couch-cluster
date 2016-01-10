# couch-cluster
Two virtual clusters for asset storage in Couchbase.

## Dependencies
1. Install Virtualbox: https://www.virtualbox.org/wiki/Downloads

2. Install Vagrant: http://www.vagrantup.com/downloads.html

3. Install necessary Vagrant plugins:

```sh
$ vagrant plugin install vagrant-hostmanager
$ vagrant plugin install vagrant-cachier
```

5. Install Ansible

```sh
$ brew install ansible
```
6. Install Node.js Playbook

```sh
$ ansible-galaxy install nodesource.node
```

## Setup
Run ```vagrant up``` from the root directory


## View the API
Navigate to couch1.vagrant:3000 to view the first datacenter cluster
Navigate to couch2.vagrant:3000 to view the second datacenter cluster

## Run Load Test

### Mac/Linux
Run ```./loadTest.sh``` from the root directory

### Windows
SSH into 'couch1' by running ```vagrant ssh couch1``` from the root directory

then run ```/vagrant/loadTest.sh```
