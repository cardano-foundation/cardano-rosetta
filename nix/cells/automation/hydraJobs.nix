{
  cell,
  inputs,
}:

import "${inputs.self}/release.nix" {
  cardano-rosetta = inputs.self;
  inherit (inputs.nixpkgs) system;
}
