{inputs, cell}:
let
  inherit (inputs) self nixpkgs ;
  inherit (nixpkgs) lib;

in {
  cardano-rosetta-server = (import (self + "/nix/pkgs.nix") {inherit (nixpkgs) system;}).packages.cardano-rosetta-server;
}
