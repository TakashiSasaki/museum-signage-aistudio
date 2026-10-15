# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "unstable"; # or "stable-24.05"

  # Use https://search.nixos.org/packages to find packages.
  # We've included nodejs-22 and a formatter that you can use for this file.
  packages = [
    pkgs.nodejs_22
    pkgs.nixpkgs-fmt
  ];

  # Sets environment variables in the workspace.
  env = { };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
    ];

    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file.
      onCreate = {
        npm-install = "npm i --no-audit --no-progress --timing";
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook.
      # onStart = {
      #   npm-install = "npm i --no-audit --no-progress --timing";
      # };
    };

    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
  };
}
