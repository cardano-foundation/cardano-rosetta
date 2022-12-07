{
  sources ? import ./sources.nix,
  system ? builtins.currentSystem,
}:

let
  iohkNix = import sources.iohk-nix {};
  overlay = self: super: {
    packages = self.callPackages ./packages.nix { };
  };
in
  import iohkNix.nixpkgs {
    overlays = [ overlay ];
    config = {};
    inherit system;
  }
