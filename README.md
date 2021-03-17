### What is covid-pass?

covid-pass is a blockchain implementation of a vaccination certificate, designed specifically to assist in the fight against COVID-19.

#### How does covid-pass work?

covid-pass is comprised of a front end web interface and a smart contract hosted on a decentralised network, in this case the Ethereum network. 

Using MetaMask and Google Chrome, you can interact with this contract. The web interface will autometically determine whether the user accessing it is a health organisation or a normal user. This is due to the two different users being served different interfaces, related to what they may wish to use it for. 

##### Health Organisations

Health organisations are presented with an interface which allows them to add/remove vaccinated citizens from the ledger, while also verifying new health organisations. Health organisations require verification to ensure people cannot just add themselves as a vaccinated citizen and gain entry to venues or travel. 

##### Businesses/Public

Businesses or the public are presented with a different interface which is much simpler. You can lookup citizens by using their unique hash. The contract will then serve that citizens entry if it exists. Decisions can then be made using this data, regarding things such as entry to a venue. 
