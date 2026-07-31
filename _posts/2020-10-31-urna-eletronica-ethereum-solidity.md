---
title: "Urna Eletrônica com Ethereum e Solidity"
date: 2020-10-31
description: "Implementação de um sistema de votação eletrônica usando contratos inteligentes na blockchain Ethereum com Solidity."
excerpt_text: "Implementação de um sistema de votação eletrônica usando contratos inteligentes na blockchain Ethereum com Solidity."
tag_label: "Blog"
tag_class: "pub-tag--blog"
tag_icon: "rss"
categories: [blockchain]
card_description: "Implementação de um sistema de votação eletrônica usando contratos inteligentes na blockchain Ethereum com Solidity."
schema_type: BlogPosting
date_display: "31 de outubro de 2020"
---

<p>Publiquei esse vídeo/tutorial no meu canal no YouTube explicando, passo a passo, a criação de uma urna eletrônica simples para votação de condomínio usando Blockchain e Smart Contracts. Para isso, escolhemos como Blockchain a Ethereum para armazenar os votos e criamos a lógica de votação usando "DApps" em Solidity.</p>

<iframe width="560" height="315" src="https://www.youtube.com/embed/V6zTSr3hB3U?si=PHGFy1M6HWY-ryxP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<h2>Código em Solidity</h2>

<pre>
<code>// SPDX-License-Identifier: GPL-2.0-or-later

// Criado por Alexandre Siqueira para o Canal do Youtube Techstudio Podcast
// Link para o tutorial: https://youtu.be/V6zTSr3hB3U
pragma solidity >=0.7.4;

contract Votacao {
    address public sindico;
    string public pauta;

    enum Opcao { Sim, Nao, Nulo, Abstencao }

    mapping (Opcao => address[]) voto;
    mapping (address => bool) moradores;

    constructor (string memory _pauta){
        sindico = msg.sender;
        pauta = _pauta;
    }

    function votar (Opcao _opcao) public {
        require(!moradores[msg.sender], "Morador ja votou!");
        voto[_opcao].push(msg.sender);
        moradores[msg.sender] = true;
    }

    function verResultado (Opcao _opcao) public view returns (address[] memory){
        return (voto[_opcao]);
    }
}</code>
</pre>

<h2>Referências:</h2>
<p><a href="https://github.com/alex-siqueira/urna-eletronica-solidity">Repositório Github</a></p>
