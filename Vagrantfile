# -*- mode: ruby -*-
# # vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.ssh.insert_key = false

  if Vagrant.has_plugin?("vagrant-hostmanager")
    config.hostmanager.enabled = true
    config.hostmanager.manage_host = true
    config.hostmanager.ignore_private_ip = false
    config.hostmanager.include_offline = true
  end

  if Vagrant.has_plugin?("vagrant-cachier")
    config.cache.scope = :machine
  end

  config.vm.define "couch1" do |vmconfig|
    vmconfig.vm.box = "ubuntu/trusty64"
    vmconfig.vm.provider "virtualbox" do |v|
      v.memory = 4096
    end

    vmconfig.vm.hostname = "couch1.vagrant"
    vmconfig.vm.network :private_network, ip: "192.168.56.43"
     
    vmconfig.vm.provision "ansible" do |ansible|
      ansible.playbook = "couch1.yml"
    end
  end

  config.vm.define "couch2" do |vmconfig|
    vmconfig.vm.box = "ubuntu/trusty64"
    vmconfig.vm.provider "virtualbox" do |v|
      v.memory = 4096
    end

    vmconfig.vm.hostname = "couch2.vagrant"
    vmconfig.vm.network :private_network, ip: "192.168.56.44"
     
    vmconfig.vm.provision "ansible" do |ansible|
      ansible.playbook = "couch2.yml"
    end
  end

end