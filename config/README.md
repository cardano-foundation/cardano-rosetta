# Cardano Configurations

This repository holds the latest configurations for various core Cardano components (cardano-node, cardano-db-sync...), as well as the genesis configurations of well-known networks (i.e. mainnet, testnet, staging...). It serves as a mirror to the [Hydra configurations](https://hydra.iohk.io/job/Cardano/cardano-node/cardano-deployment/latest-finished/download/1/index.html) which can be sometimes long to fetch and lacks a better API to get specific configurations. 

The files in this repository are, when necessary, **updated automatically by a cron-job once a day**. And, since they're a Git repository, they can be added to a project as a Git submodule and specific configurations can be pinned via a commit reference. Incidentally, the folder structure is network-centric, and works well for setup where the network is fixed via an command-line option or environment variable. 

---

<p align="center">
  <a href='https://github.com/cardanosolutions/ogmios/actions?query=workflow%3A"Continuous Integration"'><img src="https://img.shields.io/github/workflow/status/input-output-hk/cardano-configurations/Refresh%20Configurations?label=CRON%20JOB&style=for-the-badge"/></a>
</p>
