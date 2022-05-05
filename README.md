## Chain Runner

Run javascript straight from an evm smart contract

Needs docker
```
sudo apt-get remove docker docker-engine docker.io containerd runc
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo   "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### TODO

- Make a convenient way to create the ipfs uploads.
- Fix open host port to container.
- Management of execution nodes by the dispatch contract.
- Make some integration tests.
- Protect vm runner from dos attacks.
