# Polymer3 element pour Spoggy3 https://github.com/scenaristeur/spoggy3
tested with Firefox 62 on windows & Linux Mint for the moment (there is a pb betweeen evejs & chrome)
 with nodejs 10 & 11
 


# Prerequis
- installer nodejs LTS (long terme support)
https://nodejs.org/fr/download/
- installer Polymer en global
```
npm i  -g polymer-cli
```

# Recupérer le code source

```
git clone https://github.com/scenaristeur/spoggy-graph.git
cd spoggy-graph
npm install

```

# launch DEMO
```
polymer serve --open
```

# launch DEV Server
```
polymer serve
```

# Use with fuseki endpoint
- first, tou need to start your fuseki endpoint and add at least one dataset



# source https://github.com/Polymer/lit-element




    Add LitElement to your project:

    npm i @polymer/lit-element

    Install the webcomponents polyfill. If you're developing a reusable package, this should be a dev dependency which you load in your tests, demos, etc.

    npm i -D @webcomponents/webcomponentsjs

    Create an element by extending LitElement and calling customElements.define with your class (see the examples below).

    Install the Polymer CLI:

    npm i -g polymer-cli

    Run the development server and open a browser pointing to its URL:

    polymer serve


    * lancer la demo
    ```
    polymer serve --open
    ```


githubpages & releases https://www.polymer-project.org/1.0/docs/tools/reusable-elements obsolète

si pb EACCESS lors de l'install de Polymer
sudo npm i -g polymer-cli --unsafe-perm

TODO ajouter demo a githubpages : https://github.com/zellwk/chatapp-polymer/blob/master/docs/deploy-to-github-pages.md

# rdf-ext https://github.com/rdf-ext/documentation

# lit-html exemples :
https://alligator.io/web-components/lit-html/

https://github.com/LarsDenBakker/lit-html-examples

https://gist.github.com/WebReflection/ab43649d9e4a53ac900b5924c77a310e

# rdflib doc
doc http://linkeddata.github.io/rdflib.js/doc/UpdateManager.htm

# ethereum decentralized
voir aussi https://github.com/llSourcell/Your_First_Decentralized_Application

# History
02-11-2018 : fixed evejs , hypertimer & distribus vulnerabilities
