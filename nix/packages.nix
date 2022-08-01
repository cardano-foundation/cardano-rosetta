{ lib, pkgs }:

let
  #nodePackages = pkgs.callPackage ./node-packages {};
  packages = self: {
    sources = import ./sources.nix;
    nodejs = (import self.sources.nixos2205 {}).nodejs;
    nix-inclusive = pkgs.callPackage "${self.sources.nix-inclusive}/inclusive.nix" {};
    inherit (self.yarn-static.passthru) offlinecache;
    cardano-rosetta-server = self.callPackage ./cardano-rosetta-server.nix {};
  };
in pkgs.lib.makeScope pkgs.newScope packages
