{ system ? builtins.currentSystem }:

let pkgs = import ./nix/pkgs.nix { inherit system; }; in pkgs.packages
